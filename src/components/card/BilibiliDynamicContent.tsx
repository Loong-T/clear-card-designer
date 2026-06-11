import actionCommentIcon from "../../assets/bilibili-dynamic/icons/action-comment.svg";
import actionForwardIcon from "../../assets/bilibili-dynamic/icons/action-forward.svg";
import actionLikeIcon from "../../assets/bilibili-dynamic/icons/action-like.svg";
import moreVerticalIcon from "../../assets/bilibili-dynamic/icons/more-vertical.svg";
import topicHashIcon from "../../assets/bilibili-dynamic/icons/topic-hash.svg";
import blueAvatarBadge from "../../assets/bilibili-dynamic/images/avatar-badge-blue.png";
import goldAvatarBadge from "../../assets/bilibili-dynamic/images/avatar-badge-gold.png";
import defaultAvatarDecoration from "../../assets/bilibili-dynamic/images/avatar-decoration.png";
import defaultAvatarFace from "../../assets/bilibili-dynamic/images/avatar-face.jpg";
import defaultFansBadge from "../../assets/bilibili-dynamic/images/fans-badge.png";
import bilibiliLogo from "../../assets/icons/logo-bilibili-pink.png";
import type { CardContent } from "../../types/editor";

function AvatarBlock({ content }: { content: CardContent }) {
  const avatarUrl = content.avatarUrl || defaultAvatarFace;
  const avatarDecorationUrl = content.avatarDecorationUrl || defaultAvatarDecoration;
  const avatarBadgeUrl = content.avatarBadgeStyle === "blue" ? blueAvatarBadge : goldAvatarBadge;

  return (
    <div className="relative grid size-16 shrink-0 place-items-center">
      {content.showAvatarDecoration ? (
        <img
          alt=""
          className="absolute inset-0 h-full w-full object-contain"
          src={avatarDecorationUrl}
        />
      ) : null}
      <img alt="" className="relative size-9 rounded-full object-cover" src={avatarUrl} />
      {content.showAvatarBadge ? (
        <span className="absolute right-2.5 bottom-2.5 grid size-[15px] place-items-center rounded-full bg-white">
          <img alt="" className="size-[13px] rounded-full object-contain" src={avatarBadgeUrl} />
        </span>
      ) : null}
    </div>
  );
}

function AuthorHeader({ content }: { content: CardContent }) {
  const badgeImageUrl = content.badgeImageUrl || defaultFansBadge;
  const selectedBadgeFont = content.badgeFontFamily.replaceAll("\\", "\\\\").replaceAll('"', '\\"');
  const badgeFontFamily = `"${selectedBadgeFont}", "DIN Alternate", "Arial Narrow", Arial, sans-serif`;

  return (
    <div className="flex h-16 min-w-0 flex-1 items-center gap-1">
      <div className="flex h-9 min-w-0 flex-1 flex-col justify-between">
        <p className="m-0 truncate text-[14px] leading-[18px] font-medium text-[#ff6699] -translate-y-1">
          {content.nickname}
        </p>
        <p className="m-0 truncate text-[12px] leading-[18px] font-medium text-[#9499a0] translate-y-1">
          {content.timestamp}
        </p>
      </div>
      {content.showBadgeImage ? (
        <div className="relative shrink-0">
          <img
            alt=""
            className="block w-auto max-w-none object-contain"
            src={badgeImageUrl}
            style={{ height: `${content.badgeImageHeight}px` }}
          />
          <span
            className="absolute inset-y-0 left-0 flex w-[110%] items-center justify-center text-center leading-none"
            style={{
              color: content.badgeTextColor,
              fontFamily: badgeFontFamily,
              fontSize: `${content.badgeFontSize}px`,
              fontSynthesis: "weight",
              fontWeight: content.badgeFontWeight,
              letterSpacing: `${content.badgeLetterSpacing}px`,
            }}
          >
            {content.badgeText}
          </span>
        </div>
      ) : null}
      <img alt="" className="h-5 w-5 shrink-0 object-contain" src={moreVerticalIcon} />
    </div>
  );
}

function EngagementBar({ content }: { content: CardContent }) {
  return (
    <div
      className="mt-auto grid h-[48px] w-full grid-cols-3 items-center pb-1.5 text-[13px] leading-[18px] text-[#61666d]"
      style={{ backgroundColor: `rgba(255, 255, 255, ${content.panelOpacity})` }}
    >
      <span className="inline-flex min-w-0 items-center justify-center gap-2">
        <img alt="" className="h-[18px] w-[18px]" src={actionForwardIcon} />
        {content.repostCount}
      </span>
      <span className="inline-flex min-w-0 items-center justify-center gap-2">
        <img alt="" className="h-[18px] w-[18px]" src={actionCommentIcon} />
        {content.commentCount}
      </span>
      <span className="inline-flex min-w-0 items-center justify-center gap-2">
        <img alt="" className="h-[18px] w-[18px]" src={actionLikeIcon} />
        {content.likeCount}
      </span>
    </div>
  );
}

export function BilibiliDynamicContent({ content }: { content: CardContent }) {
  const logoUrl = content.logoUrl || bilibiliLogo;

  return (
    <div className="relative z-3 flex min-h-0 flex-1 flex-col text-[#61666d] pointer-events-none">
      <div
        className="shrink-0"
        style={{ backgroundColor: `rgba(255, 255, 255, ${content.panelOpacity})` }}
      >
        {content.showBilibiliBar ? (
          <div className="grid h-[42px] place-items-center pt-4">
            <img alt="bilibili" className="h-[25px] w-auto object-contain" src={logoUrl} />
          </div>
        ) : null}

        <div className="px-6 py-4">
          <div className="flex h-16 items-stretch gap-3">
            <AvatarBlock content={content} />
            <AuthorHeader content={content} />
          </div>

          {content.showTopic ? (
            <div className="pt-2 px-1 flex min-h-5 items-center font-medium gap-1 text-[15px] leading-5 text-[#00699d]">
              <img alt="" className="h-3.5 w-3.5 object-contain" src={topicHashIcon} />
              <span>{content.topic}</span>
            </div>
          ) : null}

          <div className="w-full px-1 pt-2 text-[14px] font-normal leading-[23px] whitespace-pre-wrap wrap-break-word text-[#18191c]">
            {content.body}
          </div>
        </div>
      </div>

      <div className="min-h-6 flex-1 bg-transparent" />
      <EngagementBar content={content} />
    </div>
  );
}
