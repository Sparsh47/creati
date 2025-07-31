export default function FlowPage({params}: {params: {id: string}}) {
    return (
        <div className="w-full h-screen flex items-center justify-center">
            <p>{params.id ?? "Individual design page"}</p>
        </div>
    )
}