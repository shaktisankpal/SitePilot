import { useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
    fetchPages, fetchPage, createPage, deletePage, updateSections, saveDraft,
    setSelectedSection, setCurrentPage, updateLocalSections, updateSectionProps,
    setActiveEditors, applyRemoteUpdate,
} from "../../store/slices/builderSlice.js";
import { publishWebsite } from "../../store/slices/websiteSlice.js";
import { getSocket, connectSocket } from "../../services/socket.js";
import toast from "react-hot-toast";
import {
    ArrowLeft, Plus, Trash2, GripVertical, Rocket, Save,
    Users, Pencil, FileText, Eye, Loader2,
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import SectionEditor from "./SectionEditor.jsx";
import { SECTION_MAP } from "../publicSite/PublicSiteRenderer.jsx";

const SECTION_TYPES = ["Hero", "Navbar", "Footer", "Text", "Gallery", "CTA", "ContactForm"];

const SECTION_COLORS = {
    Hero: "#6366f1", Navbar: "#0ea5e9", Footer: "#64748b",
    Text: "#10b981", Gallery: "#f59e0b", CTA: "#ec4899", ContactForm: "#8b5cf6",
};

export default function BuilderPage() {
    const { websiteId, pageId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, token, tenant } = useSelector((s) => s.auth);
    const { pages, currentPage, selectedSectionId, saving, activeEditors } = useSelector((s) => s.builder);

    const autoSaveRef = useRef(null);

    // Connect socket and join page room
    useEffect(() => {
        const socket = connectSocket(token);
        if (socket && pageId) {
            socket.emit("join:page", { pageId, userName: user?.name });

            socket.on("editors:update", ({ editors }) => {
                dispatch(setActiveEditors(editors));
            });

            socket.on("content:update", (data) => {
                if (data.updatedBy !== user?._id) {
                    dispatch(applyRemoteUpdate(data));
                }
            });

            socket.on("autosave:success", ({ savedAt }) => {
                // silent success
            });
        }

        return () => {
            const s = getSocket();
            if (s && pageId) {
                s.emit("leave:page", { pageId });
                s.off("editors:update");
                s.off("content:update");
                s.off("autosave:success");
            }
        };
    }, [pageId, token, user]);

    // Load pages + current page
    useEffect(() => {
        dispatch(fetchPages(websiteId));
        if (pageId) dispatch(fetchPage({ websiteId, pageId }));
    }, [websiteId, pageId, dispatch]);

    // Auto-save every 10 seconds
    useEffect(() => {
        if (!currentPage) return;

        autoSaveRef.current = setInterval(() => {
            const socket = getSocket();
            if (socket?.connected) {
                socket.emit("autosave", {
                    pageId: currentPage._id,
                    layoutConfig: currentPage.layoutConfig,
                });
            }
        }, 10000);

        return () => clearInterval(autoSaveRef.current);
    }, [currentPage]);

    const handlePageSelect = (page) => {
        navigate(`/websites/${websiteId}/builder/${page._id}`);
        dispatch(setCurrentPage(page));
    };

    const handleAddPage = async () => {
        const title = prompt("Page title:");
        if (!title) return;
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        const res = await dispatch(createPage({ websiteId, data: { title, slug } }));
        if (createPage.fulfilled.match(res)) {
            toast.success("Page created");
            navigate(`/websites/${websiteId}/builder/${res.payload._id}`);
        } else {
            toast.error(res.payload || "Failed to create page");
        }
    };

    const handleDeletePage = async (page) => {
        if (page.isHomePage) return toast.error("Cannot delete homepage");
        if (!confirm(`Delete "${page.title}"?`)) return;
        const res = await dispatch(deletePage({ websiteId, pageId: page._id }));
        if (deletePage.fulfilled.match(res)) {
            toast.success("Page deleted");
            const remaining = pages.filter((p) => p._id !== page._id);
            if (remaining.length > 0) navigate(`/websites/${websiteId}/builder/${remaining[0]._id}`);
        }
    };

    const handleAddSection = (type) => {
        if (!currentPage) return;
        const newSection = {
            id: uuidv4(),
            type,
            props: getDefaultProps(type),
            order: currentPage.layoutConfig.sections.length,
        };
        const newSections = [...currentPage.layoutConfig.sections, newSection];
        dispatch(updateLocalSections(newSections));
        broadcastUpdate(newSections);
    };

    const handleDeleteSection = (sectionId) => {
        if (!currentPage) return;
        const newSections = currentPage.layoutConfig.sections.filter((s) => s.id !== sectionId);
        dispatch(updateLocalSections(newSections));
        broadcastUpdate(newSections);
        if (selectedSectionId === sectionId) dispatch(setSelectedSection(null));
    };

    const handleDragEnd = (result) => {
        if (!result.destination || !currentPage) return;
        const items = [...currentPage.layoutConfig.sections];
        const [moved] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, moved);
        const reordered = items.map((s, i) => ({ ...s, order: i }));
        dispatch(updateLocalSections(reordered));
        broadcastUpdate(reordered);
    };

    const broadcastUpdate = useCallback((sections) => {
        const socket = getSocket();
        if (socket?.connected && currentPage) {
            socket.emit("content:update", {
                pageId: currentPage._id,
                sections,
                userId: user?._id,
            });
        }
    }, [currentPage, user]);

    const handleSaveDraft = async () => {
        if (!currentPage) return;
        const res = await dispatch(saveDraft({
            websiteId,
            pageId: currentPage._id,
            layoutConfig: currentPage.layoutConfig,
        }));
        if (saveDraft.fulfilled.match(res)) toast.success("Draft saved ✓");
        else toast.error("Save failed");
    };

    const handlePublish = async () => {
        const res = await dispatch(publishWebsite(websiteId));
        if (publishWebsite.fulfilled.match(res)) toast.success("Website published! 🚀");
        else toast.error("Publish failed");
    };

    const canPublish = ["OWNER", "ADMIN"].includes(user?.role);
    const canEdit = ["OWNER", "ADMIN", "EDITOR", "DEVELOPER"].includes(user?.role);

    return (
        <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg-base)" }}>
            {/* 1. Left Panel — Pages */}
            <div
                style={{
                    width: "220px", minWidth: "220px", background: "var(--bg-surface)",
                    borderRight: "1px solid var(--border-color)", display: "flex", flexDirection: "column", overflow: "hidden",
                }}
            >
                <div className="p-3 flex flex-col gap-3" style={{ borderBottom: "1px solid var(--border-color)" }}>
                    <Link
                        to={`/websites`}
                        className="flex items-center gap-2 text-sm"
                        style={{ color: "var(--text-muted)", textDecoration: "none", alignSelf: "flex-start" }}
                    >
                        <ArrowLeft size={14} /> Back
                    </Link>
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-semibold uppercase" style={{ color: "var(--text-muted)", letterSpacing: "0.08em" }}>
                            Pages
                        </h3>
                        {canEdit && (
                            <button onClick={handleAddPage} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-primary)" }}>
                                <Plus size={16} />
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2">
                    {pages.map((page) => {
                        const active = page._id === currentPage?._id;
                        return (
                            <div
                                key={page._id}
                                className="flex items-center gap-2 px-2 py-2 rounded-lg mb-1 group cursor-pointer"
                                onClick={() => handlePageSelect(page)}
                                style={{
                                    background: active ? "rgba(99,102,241,0.15)" : "transparent",
                                    border: active ? "1px solid rgba(99,102,241,0.3)" : "1px solid transparent",
                                }}
                            >
                                <FileText size={13} style={{ color: active ? "var(--color-primary)" : "var(--text-muted)", flexShrink: 0 }} />
                                <span className="text-sm flex-1 truncate" style={{ color: active ? "var(--color-primary)" : "var(--text-secondary)" }}>
                                    {page.title}
                                </span>
                                {page.isHomePage && (
                                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>H</span>
                                )}
                                {!page.isHomePage && canEdit && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDeletePage(page); }}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                                        style={{ background: "none", border: "none", cursor: "pointer", color: "#f87171" }}
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 2. Left Panel 2 — Page Layers (DND) */}
            {currentPage && (
                <div
                    style={{
                        width: "300px", minWidth: "300px", background: "var(--bg-surface)",
                        borderRight: "1px solid var(--border-color)", display: "flex", flexDirection: "column", overflow: "hidden",
                    }}
                >
                    <div className="flex items-center justify-between p-3" style={{ borderBottom: "1px solid var(--border-color)" }}>
                        <h3 className="text-xs font-semibold uppercase" style={{ color: "var(--text-muted)", letterSpacing: "0.08em" }}>
                            Page Layers (Sections)
                        </h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2">
                        <DragDropContext onDragEnd={handleDragEnd}>
                            <Droppable droppableId="sections">
                                {(provided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                                        {currentPage.layoutConfig.sections.map((section, index) => {
                                            const isSelected = selectedSectionId === section.id;
                                            return (
                                                <Draggable key={section.id} draggableId={section.id} index={index} isDragDisabled={!canEdit}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            onClick={() => canEdit && dispatch(setSelectedSection(isSelected ? null : section.id))}
                                                            className="rounded-xl transition-all"
                                                            style={{
                                                                border: isSelected
                                                                    ? `2px solid ${SECTION_COLORS[section.type] || "var(--color-primary)"}`
                                                                    : "2px solid var(--border-color)",
                                                                background: snapshot.isDragging ? "var(--bg-card)" : "var(--bg-input)",
                                                                cursor: canEdit ? "pointer" : "default",
                                                                ...provided.draggableProps.style,
                                                            }}
                                                        >
                                                            <div className="flex items-center gap-3 px-3 py-2">
                                                                {canEdit && (
                                                                    <span {...provided.dragHandleProps} className="drag-handle" style={{ color: "var(--text-muted)" }}>
                                                                        <GripVertical size={14} />
                                                                    </span>
                                                                )}
                                                                <span
                                                                    className="text-xs font-bold px-2 py-1 rounded-md"
                                                                    style={{
                                                                        background: `${SECTION_COLORS[section.type]}20`,
                                                                        color: SECTION_COLORS[section.type] || "var(--color-primary)",
                                                                        border: `1px solid ${SECTION_COLORS[section.type]}40`,
                                                                        fontSize: "10px",
                                                                    }}
                                                                >
                                                                    {section.type}
                                                                </span>
                                                                {section.props?.heading && (
                                                                    <span className="text-xs truncate flex-1" style={{ color: "var(--text-secondary)" }}>
                                                                        {section.props.heading}
                                                                    </span>
                                                                )}
                                                                {canEdit && (
                                                                    <button
                                                                        onClick={(e) => { e.stopPropagation(); handleDeleteSection(section.id); }}
                                                                        style={{ background: "none", border: "none", cursor: "pointer", color: "#f87171", marginLeft: "auto" }}
                                                                    >
                                                                        <Trash2 size={12} />
                                                                    </button>
                                                                )}
                                                            </div>
                                                            {/* Editor Inline */}
                                                            {isSelected && canEdit && (
                                                                <div
                                                                    className="px-3 pb-3 pt-1 animate-fade-in"
                                                                    style={{ borderTop: "1px solid var(--border-color)" }}
                                                                    onClick={(e) => e.stopPropagation()}
                                                                >
                                                                    <SectionEditor
                                                                        section={section}
                                                                        onChange={(props) => {
                                                                            dispatch(updateSectionProps({ sectionId: section.id, props }));
                                                                            broadcastUpdate(
                                                                                currentPage.layoutConfig.sections.map((s) =>
                                                                                    s.id === section.id ? { ...s, props: { ...s.props, ...props } } : s
                                                                                )
                                                                            );
                                                                        }}
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </Draggable>
                                            );
                                        })}
                                        {provided.placeholder}
                                        {currentPage.layoutConfig.sections.length === 0 && (
                                            <div className="text-center py-10" style={{ border: "2px dashed var(--border-color)", borderRadius: "var(--radius-md)" }}>
                                                <p style={{ color: "var(--text-muted)", fontSize: "12px" }}>No sections. Add from right.</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </div>
                </div>
            )}

            {/* 3. Center — Canvas Safari Window */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
                {/* Toolbar */}
                <div
                    className="flex justify-between items-center px-4 py-2 relative z-10"
                    style={{ background: "var(--bg-surface)", borderBottom: "1px solid var(--border-color)", height: "52px" }}
                >
                    <div className="flex items-center gap-3">
                        <h2 className="font-semibold text-sm flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                            <Eye size={16} /> Live Preview
                        </h2>
                    </div>

                    <div className="flex items-center gap-2">
                        {activeEditors.length > 0 && (
                            <div className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{ background: "var(--bg-input)", border: "1px solid var(--border-color)" }}>
                                <Users size={12} style={{ color: "var(--text-muted)" }} />
                                <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{activeEditors.length}</span>
                                <div className="flex -space-x-1">
                                    {activeEditors.slice(0, 3).map((ed) => (
                                        <div
                                            key={ed.socketId}
                                            className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold border border-gray-800"
                                            style={{ background: ed.color, color: "white", fontSize: "9px" }}
                                            title={ed.userName}
                                        >
                                            {ed.userName?.[0]}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {canEdit && (
                            <button
                                onClick={handleSaveDraft}
                                disabled={saving}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm"
                                style={{
                                    background: "var(--bg-input)", border: "1px solid var(--border-color)",
                                    color: "var(--text-primary)", cursor: "pointer",
                                }}
                            >
                                {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />} Save
                            </button>
                        )}
                        {canPublish && (
                            <button
                                onClick={handlePublish}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium"
                                style={{
                                    background: "linear-gradient(135deg, #10b981, #34d399)",
                                    color: "white", border: "none", cursor: "pointer",
                                }}
                            >
                                <Rocket size={13} /> Publish
                            </button>
                        )}
                    </div>
                </div>

                {/* Canvas Background and Safari Mock */}
                <div className="flex-1 overflow-auto p-4 md:p-8 relative" style={{ background: "var(--bg-base)" }}>
                    {currentPage ? (
                        <div
                            className="mx-auto flex flex-col rounded-2xl overflow-hidden shadow-2xl"
                            style={{
                                maxWidth: "1000px", minHeight: "60vh", background: "#0f0f1a",
                                border: "1px solid rgba(255,255,255,0.1)",
                                animation: "fade-in 0.5s ease-out"
                            }}
                        >
                            {/* Safari Headers */}
                            <div className="flex items-center px-4 py-3" style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ background: "#ff5f56" }} />
                                    <div className="w-3 h-3 rounded-full" style={{ background: "#ffbd2e" }} />
                                    <div className="w-3 h-3 rounded-full" style={{ background: "#27c93f" }} />
                                </div>
                                <div className="mx-auto px-4 py-1 rounded-md text-xs font-medium" style={{ background: "rgba(0,0,0,0.5)", color: "#9ca3af" }}>
                                    {currentPage.slug === "home" ? "yoursite.com" : `yoursite.com/${currentPage.slug}`}
                                </div>
                            </div>

                            {/* Actual Preview Content */}
                            <div className="flex-1 font-sans" style={{ color: "#f0f0ff" }}>
                                {currentPage.layoutConfig.sections.map((section) => {
                                    const Component = SECTION_MAP[section.type];
                                    if (!Component) return null;
                                    return (
                                        <div key={section.id}
                                            style={{
                                                position: "relative",
                                                outline: selectedSectionId === section.id ? `2px solid ${SECTION_COLORS[section.type] || "var(--color-primary)"}` : "none",
                                                transition: "outline 0.2s"
                                            }}
                                            onClick={() => canEdit && dispatch(setSelectedSection(section.id))}
                                        >
                                            <Component props={section.props || {}} branding={tenant?.branding} />
                                        </div>
                                    );
                                })}
                                {currentPage.layoutConfig.sections.length === 0 && (
                                    <div className="flex items-center justify-center p-20 text-center">
                                        <p style={{ color: "#606090", fontSize: "16px" }}>Page is empty. Drag an Add Section from the right panel.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center">
                            <p style={{ color: "var(--text-muted)" }}>Select a page to edit</p>
                        </div>
                    )}
                </div>
            </div>

            {/* 4. Right panel — Add Section Library */}
            {canEdit && (
                <div
                    style={{
                        width: "180px", minWidth: "180px", background: "var(--bg-surface)",
                        borderLeft: "1px solid var(--border-color)", display: "flex", flexDirection: "column", overflow: "hidden",
                    }}
                >
                    <div className="p-3" style={{ borderBottom: "1px solid var(--border-color)", flexShrink: 0 }}>
                        <h3 className="text-xs font-semibold uppercase" style={{ color: "var(--text-muted)", letterSpacing: "0.08em" }}>
                            Add Section
                        </h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {SECTION_TYPES.map((type) => (
                            <button
                                key={type}
                                onClick={() => handleAddSection(type)}
                                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left font-medium"
                                style={{
                                    background: "var(--bg-input)", border: "1px solid var(--border-color)",
                                    color: "var(--text-secondary)", cursor: "pointer", transition: "var(--transition)",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = SECTION_COLORS[type];
                                    e.currentTarget.style.color = SECTION_COLORS[type];
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = "var(--border-color)";
                                    e.currentTarget.style.color = "var(--text-secondary)";
                                }}
                            >
                                <span
                                    className="w-2 h-2 rounded-full flex-shrink-0"
                                    style={{ background: SECTION_COLORS[type], boxShadow: `0 0 8px ${SECTION_COLORS[type]}` }}
                                />
                                {type}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function getDefaultProps(type) {
    const defaults = {
        Hero: { heading: "Welcome", subheading: "Your tagline here", ctaText: "Get Started", ctaLink: "#" },
        Navbar: { brand: "Brand", links: ["Home", "About", "Contact"] },
        Footer: { text: `© ${new Date().getFullYear()} Your Company. All rights reserved.` },
        Text: { heading: "Section Title", description: "Write your content here." },
        Gallery: { heading: "Our Gallery", items: ["Image 1", "Image 2", "Image 3"] },
        CTA: { heading: "Ready to start?", subheading: "Join us today.", ctaText: "Get Started", ctaLink: "#" },
        ContactForm: { heading: "Contact Us", fields: ["name", "email", "message"] },
    };
    return defaults[type] || {};
}
