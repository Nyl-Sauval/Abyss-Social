type UserAvatarProps = {
  readonly username?: string;
  readonly profilePicture?: string | null | { data: string } | undefined;
  readonly alt?: string;
  readonly className?: string;
  readonly fallbackClassName?: string;
  readonly imgClassName?: string;
};

export default function UserAvatar({
  username,
  profilePicture,
  alt,
  className = "",
  fallbackClassName = "",
  imgClassName = "",
}: UserAvatarProps) {
  const initial = username?.trim().charAt(0).toUpperCase() || "?";
  const imageAlt = alt ?? `Photo de profil de ${username ?? "utilisateur"}`;

  // Format the profile picture data to ensure it's a valid image source because the API can return it in various formats (Base64, URL, or an object with a data property).
  const getFullImageData = (picture: string | null | { data: string } | undefined): string | null => {
    if (!picture) return null;

    let rawData = "";

    // Case 1 : object with a "data" property (e.g., { data: "iVBOR..." })
    if (typeof picture === "object" && picture.data) {
      rawData = picture.data;
    }
    // Case 2 : string (could be a Base64 string, a URL, or already a full data URI)
    else if (typeof picture === "string") {
      rawData = picture;
    }

    // If rawData is empty or still an object, we can't use it as an image source
    if (!rawData || rawData === "[object Object]") return null;

    // If rawData already looks like a URL or a data URI, we can use it directly
    if (rawData.startsWith("http") || rawData.startsWith("data:image")) {
      return rawData;
    }

    // Otherwise, we assume it's a Base64 string and construct a data URI
    return `data:image/png;base64,${rawData}`;
  };

  const imgSrc = getFullImageData(profilePicture);

  return (
    <div className={`overflow-hidden ${className}`.trim()}>
      {imgSrc ? (
        <img
          src={imgSrc}
          alt={imageAlt}
          className={`h-full w-full object-cover ${imgClassName}`.trim()}
        />
      ) : (
        <div
          aria-hidden="true"
          className={`flex h-full w-full items-center justify-center ${fallbackClassName}`.trim()}
        >
          {initial}
        </div>
      )}
    </div>
  );
}
