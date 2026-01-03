"use client";

import { useState } from "react";
import {
    X,
    Link as LinkIcon,
    Users,
    Share2,
    Copy,
    Check,
    Lock,
    Globe,
    UserPlus,
    Mail,
    ChevronDown,
} from "lucide-react";

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    tripName: string;
    tripId: string;
}

export function ShareTripModal({ isOpen, onClose, tripName, tripId }: ShareModalProps) {
    const [activeTab, setActiveTab] = useState<"link" | "invite" | "social">("link");
    const [linkCopied, setLinkCopied] = useState(false);
    const [visibility, setVisibility] = useState<"private" | "link" | "public">("private");
    const [allowEditing, setAllowEditing] = useState(false);
    const [allowCloning, setAllowCloning] = useState(true);
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteRole, setInviteRole] = useState<"viewer" | "editor">("viewer");

    const shareLink = `https://globetrotter.app/trips/${tripId}?share=abc123`;

    const copyLink = () => {
        navigator.clipboard.writeText(shareLink);
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
    };

    const pendingInvites = [
        { email: "rahul@example.com", role: "Editor", status: "pending", sent: "2 days ago" },
        { email: "sneha@example.com", role: "Viewer", status: "accepted", sent: "5 days ago" },
    ];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-scale-in overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-[#F5E6D3]">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-lg text-[#6B5B4F] hover:bg-[#F5E6D3] hover:text-[#FF6B4A] transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <h2 className="text-2xl font-bold text-[#2C2C2C]">Share Your Trip</h2>
                    <p className="text-[#6B5B4F] mt-1">Let others see your adventure</p>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-[#F5E6D3]">
                    {[
                        { id: "link", label: "Get Link", icon: LinkIcon },
                        { id: "invite", label: "Invite People", icon: Users },
                        { id: "social", label: "Social", icon: Share2 },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as typeof activeTab)}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 font-medium transition-all relative ${activeTab === tab.id ? "text-[#FF6B4A]" : "text-[#6B5B4F] hover:text-[#2C2C2C]"
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                            {activeTab === tab.id && (
                                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF6B4A]" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                    {/* Get Link Tab */}
                    {activeTab === "link" && (
                        <div className="space-y-6 animate-fade-in">
                            {/* Visibility Options */}
                            <div className="space-y-3">
                                <h4 className="font-semibold text-[#2C2C2C]">Trip Visibility</h4>
                                {[
                                    { id: "private", label: "Private", desc: "Only you can view", icon: Lock },
                                    { id: "link", label: "Shared with Link", desc: "Anyone with link", icon: LinkIcon },
                                    { id: "public", label: "Public", desc: "Listed publicly", icon: Globe },
                                ].map((opt) => (
                                    <label
                                        key={opt.id}
                                        className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${visibility === opt.id
                                                ? "border-[#FF6B4A] bg-[#FF6B4A]/5"
                                                : "border-[#E8DDD0] hover:border-[#FF6B4A]/50"
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="visibility"
                                            checked={visibility === opt.id}
                                            onChange={() => setVisibility(opt.id as typeof visibility)}
                                            className="sr-only"
                                        />
                                        <div
                                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${visibility === opt.id ? "border-[#FF6B4A]" : "border-[#D9C4A9]"
                                                }`}
                                        >
                                            {visibility === opt.id && <div className="w-2.5 h-2.5 rounded-full bg-[#FF6B4A]" />}
                                        </div>
                                        <opt.icon className={`w-5 h-5 ${visibility === opt.id ? "text-[#FF6B4A]" : "text-[#6B5B4F]"}`} />
                                        <div className="flex-1">
                                            <p className="font-medium text-[#2C2C2C]">{opt.label}</p>
                                            <p className="text-sm text-[#6B5B4F]">{opt.desc}</p>
                                        </div>
                                    </label>
                                ))}
                            </div>

                            {/* Link Input */}
                            {visibility !== "private" && (
                                <div className="space-y-3">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={shareLink}
                                            readOnly
                                            className="flex-1 px-4 py-3 rounded-xl border border-[#E8DDD0] bg-[#F5E6D3]/30 text-sm font-mono text-[#6B5B4F]"
                                        />
                                        <button
                                            onClick={copyLink}
                                            className={`px-4 py-3 rounded-xl font-semibold transition-all ${linkCopied
                                                    ? "bg-[#10B981] text-white"
                                                    : "bg-[#FF6B4A] text-white hover:bg-[#E63E23]"
                                                }`}
                                        >
                                            {linkCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                        </button>
                                    </div>

                                    {/* Options */}
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={allowEditing}
                                                onChange={(e) => setAllowEditing(e.target.checked)}
                                                className="w-4 h-4 rounded border-[#D9C4A9] text-[#FF6B4A] focus:ring-[#FF6B4A]"
                                            />
                                            <span className="text-sm text-[#2C2C2C]">Allow editing</span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={allowCloning}
                                                onChange={(e) => setAllowCloning(e.target.checked)}
                                                className="w-4 h-4 rounded border-[#D9C4A9] text-[#FF6B4A] focus:ring-[#FF6B4A]"
                                            />
                                            <span className="text-sm text-[#2C2C2C]">Allow cloning</span>
                                        </label>
                                    </div>
                                </div>
                            )}

                            <button className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF6B4A] to-[#E63E23] text-white font-semibold hover:shadow-lg transition-all">
                                Save Settings
                            </button>
                        </div>
                    )}

                    {/* Invite People Tab */}
                    {activeTab === "invite" && (
                        <div className="space-y-6 animate-fade-in">
                            {/* Invite Form */}
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B5B4F]" />
                                    <input
                                        type="email"
                                        value={inviteEmail}
                                        onChange={(e) => setInviteEmail(e.target.value)}
                                        placeholder="Enter email address"
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E8DDD0] focus:outline-none focus:border-[#FF6B4A]"
                                    />
                                </div>
                                <select
                                    value={inviteRole}
                                    onChange={(e) => setInviteRole(e.target.value as typeof inviteRole)}
                                    className="px-3 py-3 rounded-xl border border-[#E8DDD0] text-[#2C2C2C] bg-white"
                                >
                                    <option value="viewer">Viewer</option>
                                    <option value="editor">Editor</option>
                                </select>
                                <button className="px-4 py-3 rounded-xl bg-[#FF6B4A] text-white font-semibold hover:bg-[#E63E23] transition-colors">
                                    <UserPlus className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Invited List */}
                            <div className="space-y-2">
                                <h4 className="font-semibold text-[#2C2C2C]">Invited People</h4>
                                {pendingInvites.map((invite, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-3 p-3 rounded-xl bg-[#F5E6D3]/50 hover:bg-[#F5E6D3] transition-colors"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6B4A] to-[#F59E0B] flex items-center justify-center text-white font-bold">
                                            {invite.email[0].toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-[#2C2C2C] truncate">{invite.email}</p>
                                            <p className="text-xs text-[#6B5B4F]">Invited {invite.sent}</p>
                                        </div>
                                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#FF6B4A]/10 text-[#FF6B4A]">
                                            {invite.role}
                                        </span>
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${invite.status === "accepted"
                                                    ? "bg-[#10B981]/10 text-[#10B981]"
                                                    : "bg-[#F59E0B]/10 text-[#F59E0B]"
                                                }`}
                                        >
                                            {invite.status}
                                        </span>
                                        <button className="p-1 text-[#6B5B4F] hover:text-[#EF4444]">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Social Tab */}
                    {activeTab === "social" && (
                        <div className="space-y-4 animate-fade-in">
                            <p className="text-[#6B5B4F]">Share your trip on social media</p>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { name: "Facebook", color: "#1877F2", icon: "f" },
                                    { name: "Twitter", color: "#1DA1F2", icon: "𝕏" },
                                    { name: "LinkedIn", color: "#0A66C2", icon: "in" },
                                    { name: "WhatsApp", color: "#25D366", icon: "📱" },
                                    { name: "Email", color: "#FF6B4A", icon: "✉️" },
                                    { name: "Copy Link", color: "#2C2C2C", icon: "🔗" },
                                ].map((platform) => (
                                    <button
                                        key={platform.name}
                                        className="flex items-center gap-3 p-4 rounded-xl text-white font-semibold hover:-translate-y-0.5 hover:shadow-lg transition-all"
                                        style={{ backgroundColor: platform.color }}
                                    >
                                        <span className="text-lg">{platform.icon}</span>
                                        {platform.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
        @keyframes scale-in {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in {
          animation: scale-in 0.25s ease-out;
        }
      `}</style>
        </div>
    );
}

export default ShareTripModal;
