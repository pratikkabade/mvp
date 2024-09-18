import { Button, Modal } from "flowbite-react";
import { useEffect, useState } from "react";

const RedBanner = ({ onClick }: { onClick: () => void }) => {
    return (
        <nav className="w-full z-50 max-lg:static bg-red-500 fixed text-white font-semibold hover:brightness-95 dark:border-gray-700 dark:bg-gray-800 sm:px-4 flex flex-row justify-start cursor-pointer" onClick={onClick}>
            <span>⚠️ Server is not running</span>
        </nav>
    )
}

const GreenBanner = () => {
    return (
        <nav className="fixed w-full bg-green-500 hover:brightness-95 px-2 dark:border-gray-700 dark:bg-gray-800 sm:px-4 flex flex-row justify-start">
            <span>✅</span>
        </nav>
    )
}

const HiddenGreenBanner = () => {
    return (
        <nav className="fixed w-full bg-green-500 hover:brightness-95 px-2 dark:border-gray-700 dark:bg-gray-800 sm:px-4 flex flex-row justify-start fade-out2">
            <span>✅</span>
        </nav>
    )
}

const MobileBanner = () => {
    return (
        <div className="hidden max-lg:fixed bottom-0 w-full bg-red-500 fixed p-20 px-40 ">
            <span>⚠️ Server is not running</span>
        </div>
    )
}


export const ServerCheck = ({ serverIsRunningC }: { serverIsRunningC: boolean }) => {
    const [status, setStatus] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [hide, setHide] = useState(false);

    useEffect(() => {
        setStatus(serverIsRunningC);
    }, [serverIsRunningC])

    setTimeout(() => {
        setHide(true)
    }, 1500);
    console.log(hide);

    return (
        <>
            {
                status ?
                    hide ?
                        <HiddenGreenBanner />
                        :
                        <GreenBanner />
                    :
                    <>
                        <RedBanner onClick={() => setOpenModal(true)} />
                    </>
            }
            <MobileBanner />

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
                    <Button onClick={() => {
                        window.location.reload()
                    }}>Recheck</Button>
                    <Button color="gray" onClick={() => setOpenModal(false)}>
                        Ignore
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}