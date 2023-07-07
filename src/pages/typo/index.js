/*global chrome*/


import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import Logo from "../../../public/icons/Logo-48.png";
import NotFound from "../../../public/icons/not-found.png";

function Typo() {
    const [url, setUrl] = useState("");

    const fetchUrl = async () => {
        const { urlStatus } = await chrome.storage.sync.get("urlStatus");
        setUrl(urlStatus);
    };

    const handleBackToSafety = () => {
        chrome.tabs.update({ url: 'chrome://newtab' });
    };

    const handleVisitWebsite = async () => {
        const { urlStatus } = await chrome.storage.sync.get("urlStatus");
        const { exceptionList } = await chrome.storage.sync.get("exceptionList");

        if (!Array.isArray(exceptionList)) {
            // If exceptionList is not an array, initialize it as an empty array
            await chrome.storage.sync.set({ exceptionList: [] });
        }

        if (!exceptionList.includes(urlStatus)) {
            exceptionList.push(urlStatus);
            await chrome.storage.sync.set({ exceptionList });
        }

        setTimeout(() => {
            chrome.tabs.update({ url: urlStatus });
        }, 3000);

    };

    useEffect(() => {
        fetchUrl();
    }, []);
    return (
        <div>
            <Head>
                <title>BlockBait has found a typo this website</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className='w-screen overflow-x-hidden'>
                {/* header/logo */}
                <nav className='w-screen py-4 border-b'>
                    <div className="w-[90vw] mx-auto flex items-center justify-between">
                        <div className="flex items-center justify-center space-x-1">
                            <span
                                className="w-[2rem] aspect-square "
                                style={{
                                    background: `url(${Logo.src}) center center/contain no-repeat`,
                                }}
                            ></span>
                            <span className="text-center font-bold text-[#2d2964] font-sans text-[1.4rem]">
                                BlockBait
                            </span>
                        </div>
                        <h2 className='hidden'>Report as false</h2>
                    </div>
                </nav>
                {/* body */}
                <div className='w-[90vw] mx-auto mt-[5%]'>
                    <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-10">
                        <div className='flex flex-col space-y-6 items-start justify-start'>
                            <h4 className=' text-[1.5rem]'>You are visiting: <span className='font-extrabold underline'>`{url}`</span></h4>
                            <h2 className='text-[2.5rem] text-black/90'>Oops! Wrong URL</h2>
                            <p className='text-[1rem] text-black/70'>It seems you&apos;ve entered a wrong URL or made a typo. Please double-check the URL you entered as it appears to be incorrect or contains a typo.</p>
                            <p className='text-[1rem] text-black/70'> Do you mean to visit a different website instead?</p>
                            <div className='flex items-center space-x-8'>
                                <button className='px-6 py-3 rounded border-2 border-[#4E46B4]  text-[1rem] ' onClick={handleBackToSafety} role='button'>Yes! Take me back to safety</button>
                                <button className='px-6 py-3 rounded border-2  border-[#4E46B4] bg-[#4E46B4] text-[1rem] text-white' onClick={handleVisitWebsite} role='button'>No! Visit website</button>
                            </div>
                        </div>
                        {/* Typo image */}
                        <div className='w-[75%] mx-auto aspect-square' style={{
                            background: `url(${NotFound.src}) center center/contain no-repeat`,
                        }}></div>
                    </div>
                </div>
            </main>

        </div>
    )
}

export default Typo