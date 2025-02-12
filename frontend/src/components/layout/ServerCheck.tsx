import { Modal } from "flowbite-react";
import { useEffect, useState } from "react";

const RedBanner = ({ onClick }: { onClick: () => void }) => {
    return (
        <nav className="w-full fixed top-1/2 p-3 z-50 bg-red-500 text-white font-semibold hover:brightness-95 flex flex-row justify-center cursor-pointer" onClick={onClick}>
            <span>⚠️ Server is not running</span>
        </nav>
    )
}

const GreenBanner = () => {
    return (
        <nav className="w-full fixed top-1/2 p-3 z-50 bg-green-500 text-white font-semibold hover:brightness-95 flex flex-row justify-center cursor-pointer fadeOut" style={{ animation: "fadeOut 1s forwards" }}>
            <span>✅</span>
        </nav>
    )
}

export const ServerCheck = ({ serverIsRunningC }: { serverIsRunningC: boolean }) => {
    const [status, setStatus] = useState(false);
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        setStatus(serverIsRunningC);
    }, [serverIsRunningC])

    return (
        <>
            {
                status ?
                    <GreenBanner />
                    :
                    <RedBanner onClick={() => setOpenModal(true)} />
            }

            <Modal show={openModal} onClose={() => setOpenModal(false)} className="fade-in">
                <Modal.Header>⚠️ Server is down</Modal.Header>
                <Modal.Body>
                    <div className="space-y-6">
                        <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                            Please confirm if the server is running from the backend
                        </p>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-success text-white" onClick={() => {
                        window.location.reload()
                    }}>
                        Recheck
                    </button>
                    <button className="btn" onClick={() => setOpenModal(false)}>
                        Ignore
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    )
}