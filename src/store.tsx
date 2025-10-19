import { create } from 'zustand'

interface ConfiguratorState {
  groupColors: Record<string, string>
  setGroupColor: (group: string, color: string) => void
  customText: string
  setCustomText: (text: string) => void
}

export const useProductStore = create<ConfiguratorState>((set) => ({
  groupColors: {
    Nose: '#ffffff',
    BodyUp: '#ffffff',
    BodySide: '#ffffff',
    LogoInside: '#ffffff',
    Sole: '#ffffff',
    Bottom: '#ffffff',
    BodyBack: '#ffffff',
    FlapBack: '#ffffff',
    Inside: '#ffffff',
    BottomInside: '#ffffff',
    FlapTop: '#ffffff',
    Laces: '#ffffff',
    LogoBoxUp: '#ffffff',
    LogoUp: '#ffffff',
    LogoOutside: '#ffffff',
  },
  setGroupColor: (group, color) =>
    set((state) => ({
      groupColors: { ...state.groupColors, [group]: color },
    })),
  customText: "",
  setCustomText: (text) => set({ customText: text }),
}))
