import { encodeNevent, useNostrEvents } from "../nostr";
import { NoteEvent } from "./Note";
import Channel from "./Channel";

export default function NEvent({ id, relays }) {
  const { events } = useNostrEvents({
    filter: {
      ids: [id],
    },
  });
  const ev = events[0];

  if (ev?.kind === 1) {
    return <NoteEvent note={ev} />;
  }

  if (ev?.kind === 40) {
    return <Channel channel={ev} />;
  }

  return <>{encodeNevent(id, relays)}</>;
}
