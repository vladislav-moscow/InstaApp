/* eslint-disable @next/next/no-img-element */
"use client";
import Image from "next/image";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import Modal from "react-modal";
import { useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";

const Header = () => {
	const { data: session } = useSession();
	const [isOpen, setIsOpen] = useState(false);

	return (
		<header className="shadow-sm border-b sticky top-0 bg-white z-30 p-3">
			<div className="flex justify-between items-center max-w-6xl mx-auto">
				{/*Logo */}

				<Link href="/" className="hidden lg:inline-flex">
					<Image
						src="/Instagram_logo_black.webp"
						width={96}
						height={96}
						alt="logo instagram"
					/>
				</Link>
				<Link href="/" className="lg:hidden">
					<Image src="/logo.webp" width={38} height={38} alt="logo instagram" />
				</Link>

				{/*search */}

				<input
					type="text"
					placeholder="поиск..."
					className="bg-gray-50 border border-gray-200 rounded text-sm w-full py-2 px-5 max-w-[170px] sm:max-w-[210px]"
				/>

				{/*menu items */}

				{session ? (
					<div className="flex gap-6 items-center">
						<IoIosAddCircleOutline
							className="text-2xl cursor-pointer transform hover:scale-125 transition duration-300 hover:text-red-600"
							onClick={() => setIsOpen(true)}
						/>
						<img
							src={session.user.image}
							alt="avatar user"
							className="h-10 w-10 rounded-full cursor-pointer"
							onClick={signOut}
						/>
					</div>
				) : (
					<button
						onClick={signIn}
						className="text-sm font-semibold text-blue-500"
					>
						Вход
					</button>
				)}
			</div>
			{isOpen && (
				<Modal isOpen={isOpen}>
					<div>
						<h1>Modal</h1>
						<button onClick={() => setIsOpen(false)}>close</button>
					</div>
				</Modal>
			)}
		</header>
	);
};

export default Header;
