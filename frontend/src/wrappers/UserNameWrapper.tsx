import DotAnimation from "../components/animations/DotAnimation"

export const UserNameWrapper = (UserName: string) => {
    if (UserName === 'loading') return (
        <span className="border-2 border-base-300 text-base-300 rounded-md mr-2 px-1.5 cursor-default skeleton">
            {UserName}<DotAnimation />
        </span>
    )

    return (
        <span className="btn btn-xs btn-outline">
            {UserName}
        </span>
    )
}