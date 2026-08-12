// src/components/Skeleton.jsx

const styles = `
.skeleton {
    background: linear-gradient(
        90deg,
        #eef1f5 25%,
        #e3e7ed 50%,
        #eef1f5 75%
    );

    background-size: 200% 100%;
    animation: skeleton-loading 1.5s ease-in-out infinite;
}

@keyframes skeleton-loading {
    0% {
        background-position: 200% 0;
    }

    100% {
        background-position: -200% 0;
    }
}

.skeleton-stats {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 18px;
    width: 100%;
}

.skeleton-stat {
    display: flex;
    flex-direction: column;
}

@media (max-width: 900px) {
    .skeleton-stats {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

@media (max-width: 600px) {
    .skeleton-stats {
        grid-template-columns: 1fr;
    }
}

@media (prefers-reduced-motion: reduce) {
    .skeleton {
        animation: none;
    }
}
`;

if (
    typeof document !== "undefined" &&
    !document.getElementById("wsa-skeleton-styles")
) {
    const style = document.createElement("style");

    style.id = "wsa-skeleton-styles";
    style.textContent = styles;

    document.head.appendChild(style);
}


// ============================================================
// Base Skeleton
// ============================================================

export function Skeleton({
    width = "100%",
    height = "16px",
    borderRadius = "6px",
    className = "",
    style = {},
}) {
    return (
        <div
            className={`skeleton ${className}`}
            style={{
                width,
                height,
                borderRadius,
                ...style,
            }}
            aria-hidden="true"
        />
    );
}


// ============================================================
// Skeleton Stat
// ============================================================

export function SkeletonStat() {
    return (
        <div className="stat skeleton-stat">

            <Skeleton
                width="120px"
                height="16px"
            />

            <div
                style={{
                    height: "12px",
                }}
            />

            <Skeleton
                width="60px"
                height="32px"
                borderRadius="7px"
            />

        </div>
    );
}


// ============================================================
// Skeleton Stats
// ============================================================

export function SkeletonStats({
    count = 4,
}) {
    return (
        <div className="stats skeleton-stats">

            {Array.from(
                { length: count },
                (_, index) => (
                    <SkeletonStat
                        key={index}
                    />
                )
            )}

        </div>
    );
}


// ============================================================
// Skeleton Text
// ============================================================

export function SkeletonText({
    width = "100%",
    height = "16px",
}) {
    return (
        <Skeleton
            width={width}
            height={height}
        />
    );
}


// ============================================================
// Skeleton Heading
// ============================================================

export function SkeletonHeading({
    width = "180px",
    height = "28px",
}) {
    return (
        <Skeleton
            width={width}
            height={height}
            borderRadius="7px"
        />
    );
}


// ============================================================
// Skeleton Button
// ============================================================

export function SkeletonButton({
    width = "100px",
    height = "38px",
}) {
    return (
        <Skeleton
            width={width}
            height={height}
            borderRadius="8px"
        />
    );
}


// ============================================================
// Skeleton Avatar
// ============================================================

export function SkeletonAvatar({
    size = "40px",
}) {
    return (
        <Skeleton
            width={size}
            height={size}
            borderRadius="50%"
        />
    );
}


// ============================================================
// Skeleton Table Row
// ============================================================

export function SkeletonTableRow({
    columns = 5,
}) {
    return (
        <tr>

            {Array.from(
                { length: columns },
                (_, index) => (
                    <td key={index}>

                        <Skeleton
                            width={
                                index === 0
                                    ? "160px"
                                    : "100px"
                            }
                            height="18px"
                        />

                    </td>
                )
            )}

        </tr>
    );
}


// ============================================================
// Skeleton Table
// ============================================================

export function SkeletonTable({
    rows = 5,
    columns = 5,
}) {
    return (
        <tbody>

            {Array.from(
                { length: rows },
                (_, index) => (
                    <SkeletonTableRow
                        key={index}
                        columns={columns}
                    />
                )
            )}

        </tbody>
    );
}


// ============================================================
// Skeleton Card
// ============================================================

export function SkeletonCard() {
    return (
        <div className="panel">

            <div className="panel-head">

                <Skeleton
                    width="180px"
                    height="22px"
                />

            </div>

            <div className="panel-body">

                <Skeleton
                    width="100%"
                    height="16px"
                />

                <div
                    style={{
                        height: "10px",
                    }}
                />

                <Skeleton
                    width="85%"
                    height="16px"
                />

                <div
                    style={{
                        height: "10px",
                    }}
                />

                <Skeleton
                    width="70%"
                    height="16px"
                />

            </div>

        </div>
    );
}