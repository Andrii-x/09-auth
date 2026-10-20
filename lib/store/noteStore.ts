import { create } from "zustand";
import type { NoteDraft } from "@/types/note";

type NoteState = {
  draft: NoteDraft;
  setDraft: (draft: Partial<NoteDraft>) => void;
  clearDraft: () => void;
};

const emptyDraft: NoteDraft = { title: "", content: "", tag: "Todo" };

export const useNoteStore = create<NoteState>((set) => ({
  draft: emptyDraft,
  setDraft: (draft) => set((state) => ({ draft: { ...state.draft, ...draft } })),
  clearDraft: () => set({ draft: emptyDraft }),
}));
