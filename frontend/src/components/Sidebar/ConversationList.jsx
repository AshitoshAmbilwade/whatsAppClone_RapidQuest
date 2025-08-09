import React from "react";
import ConversationItem from "./ConversationItem";

/**
 * Props:
 *  - conversations: Array of conversation objects (from API)
 *  - selectedWaId: currently active wa_id (string)
 *  - onSelectConversation: function(wa_id) => void
 */
export default function ConversationList({
  conversations = [],
  selectedWaId = null,
  onSelectConversation = () => {},
}) {
  // Ensure conversations is an array
  const safeConversations = Array.isArray(conversations) ? conversations : [];

  return (
    <div className="h-full overflow-y-auto">
      {safeConversations.length === 0 ? (
        <div className="p-4 text-center text-gray-500">No conversations</div>
      ) : (
        safeConversations.map((conv) => {
          const key = conv._id || conv.wa_id || `${conv.name}-${Math.random()}`;
          return (
            <ConversationItem
              key={key}
              conversation={conv}
              active={(conv._id || conv.wa_id) === selectedWaId}
              onSelect={() => onSelectConversation(conv._id || conv.wa_id)}
            />
          );
        })
      )}
    </div>
  );
}
