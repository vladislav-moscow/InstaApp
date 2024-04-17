/* eslint-disable @next/next/no-img-element */
"use client";
import Image from "next/image";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

const Header = () => {
	const { data: session } = useSession();

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
					<img
						src={session.user.image}
						alt="avatar user"
						className="h-10 w-10 rounded-full cursor-pointer"
						onClick={signOut}
					/>
				) : (
					<button
						onClick={signIn}
						className="text-sm font-semibold text-blue-500"
					>
						Вход
					</button>
				)}
			</div>
		</header>
	);
};

export default Header;
