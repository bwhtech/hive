import { ReactRenderer } from "@tiptap/react"
import tippy, { type Instance as TippyInstance } from "tippy.js"
import { MentionList, type MentionItem, type MentionListRef } from "./MentionList"
import type { SuggestionOptions } from "@tiptap/suggestion"

export function createMentionSuggestion(
  getItems: () => MentionItem[],
): Omit<SuggestionOptions<MentionItem>, "editor"> {
  return {
    items: ({ query }) => {
      return getItems()
        .filter((item) =>
          item.label.toLowerCase().includes(query.toLowerCase()),
        )
        .slice(0, 8)
    },

    render: () => {
      let component: ReactRenderer<MentionListRef> | null = null
      let popup: TippyInstance[] | null = null

      return {
        onStart: (props) => {
          component = new ReactRenderer(MentionList, {
            props,
            editor: props.editor,
          })

          if (!props.clientRect) return

          popup = tippy("body", {
            getReferenceClientRect: props.clientRect as () => DOMRect,
            appendTo: () => document.body,
            content: component.element,
            showOnCreate: true,
            interactive: true,
            trigger: "manual",
            placement: "bottom-start",
          })
        },

        onUpdate: (props) => {
          component?.updateProps(props)

          if (props.clientRect && popup?.[0]) {
            popup[0].setProps({
              getReferenceClientRect: props.clientRect as () => DOMRect,
            })
          }
        },

        onKeyDown: (props) => {
          if (props.event.key === "Escape") {
            popup?.[0]?.hide()
            return true
          }
          return component?.ref?.onKeyDown(props) ?? false
        },

        onExit: () => {
          popup?.[0]?.destroy()
          component?.destroy()
        },
      }
    },
  }
}
