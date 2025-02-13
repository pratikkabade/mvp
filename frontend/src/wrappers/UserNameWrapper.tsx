import DotAnimation from "../components/animations/DotAnimation"

export const UserNameWrapper = (UserName: string) => {
    if (UserName === 'loading') return (
        <span className="border-2 border-base-content text-base-300 rounded-md mr-2 px-1.5 cursor-default skeleton">
            {UserName}<DotAnimation />
        </span>
    )

    return (
        <span className="border-2 border-base-content text-base-content rounded-md mr-2 px-1.5 cursor-default">
            {UserName}
        </span>
    )
}