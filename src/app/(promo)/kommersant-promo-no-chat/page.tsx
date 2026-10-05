import digest from "@/data/kommersant-promo.json";
import { KommersantChat } from "../kommersant-promo/KommersantChat";

export { metadata } from "../kommersant-promo/page";

export default function KommersantPromoNoChatPage() {
  return <KommersantChat initialDigest={digest} hideChatAfterSubmit />;
}
