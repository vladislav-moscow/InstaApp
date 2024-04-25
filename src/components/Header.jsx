/* eslint-disable @next/next/no-img-element */
'use client';
import Image from 'next/image';
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';
import Modal from 'react-modal';
import { useEffect, useRef, useState } from 'react';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { HiCamera } from 'react-icons/hi';
import { AiOutlineClose } from 'react-icons/ai';
import { app } from '@/firebase';
import {
	getDownloadURL,
	getStorage,
	ref,
	uploadBytesResumable,
} from 'firebase/storage';

const Header = () => {
	const { data: session } = useSession();
	//модальное окно
	const [isOpen, setIsOpen] = useState(false);
	// выбранный файл
	const [selectedFile, setSelectedFile] = useState(null);
	//URL загружаемой картинки
	const [imageFileUrl, setImageFileUrl] = useState(null);
	// процесс загрузки файла
	const [imageFileUploading, setImageFileUploading] = useState(false);
	//ссылаеться на инпут загрузки файлов
	const filePickerRef = useRef(null);

	/**
	 * Функиця добавление картинки
	 * @param {MouseEvent} e контекст события
	 */
	function addImageToPost(e) {
		//находи файл который хотим загрузить
		const file = e.target.files[0];
		if (file) {
			//создаем URL адрес для картинки
			setImageFileUrl(URL.createObjectURL(file));
			//помещаем файл в состояние
			setSelectedFile(file);
		}
	}
	/**
	 * при добавление файл в состояние загружает функцию загрузки файла на бэк
	 */
	useEffect(() => {
		if (selectedFile) {
			uploadImageToStorage();
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedFile]);

	/**
	 * асинхронная функция загрузки файла на бэк
	 */
	async function uploadImageToStorage() {
		//указываем что загрузка производиться
		setImageFileUploading(true);
		//ипортируем фукцию хранения в firebase
		const storage = getStorage(app);
		//устанавливаем имя файла (делаем индивидуальное имя)
		const fileName = new Date().getTime() + '-' + selectedFile.name;
		//получаем ссылку на хранилище в farebase
		const storageRef = ref(storage, fileName);
		//управляем загрузкой из farebase (передаем ссылку на хранилище и выбранный файл)
		const uploadTask = uploadBytesResumable(storageRef, selectedFile);
		//отслеживаю загрузку файла
		uploadTask.on(
			'state_changed',
			(snapshot) => {
				//отслеживание процесса загрузки
				const progress =
					(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				console.log('upload is' + progress + '% done');
			},
			//в случае ошибки  вывести ее в консоль
			(error) => {
				console.error(error);
				//указать что загрузка остановлена
				setImageFileUploading(false);
				//указываю что URl адреса файла нету
				setImageFileUrl(null);
				//указываю что файл не выбран
				setSelectedFile(null);
			},
			() => {
				//попучаю URl адресс из хранилища farebase после загрузки
				getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
					//помещаю URL адресс в состоянии
					setImageFileUrl(downloadURL);
					//указываю что файл загрузился
					setImageFileUploading(false);
				});
			}
		);
	}

	return (
		<header className='shadow-sm border-b sticky top-0 bg-white z-30 p-3'>
			<div className='flex justify-between items-center max-w-6xl mx-auto'>
				{/*Logo */}

				<Link href='/' className='hidden lg:inline-flex'>
					<Image
						src='/Instagram_logo_black.webp'
						width={96}
						height={96}
						alt='logo instagram'
						priority={true}
					/>
				</Link>
				<Link href='/' className='lg:hidden'>
					<Image src='/logo.webp' width={38} height={38} alt='logo instagram' />
				</Link>

				{/*search */}

				<input
					type='text'
					placeholder='поиск...'
					className='bg-gray-50 border border-gray-200 rounded text-sm w-full py-2 px-5 max-w-[170px] sm:max-w-[210px]'
				/>

				{/*menu items */}

				{session ? (
					<div className='flex gap-6 items-center'>
						<IoIosAddCircleOutline
							className='text-2xl cursor-pointer transform hover:scale-125 transition duration-300 hover:text-red-600'
							onClick={() => setIsOpen(true)}
						/>
						<img
							src={session.user.image}
							alt='avatar user'
							className='h-10 w-10 rounded-full cursor-pointer'
							onClick={signOut}
						/>
					</div>
				) : (
					<button
						onClick={signIn}
						className='text-sm font-semibold text-blue-500'
					>
						Вход
					</button>
				)}
			</div>
			{isOpen && (
				<Modal
					isOpen={isOpen}
					className='max-w-lg w-[90%] p-6 absolute top-56 left-[50%] translate-x-[-50%] bg-white border-2 rounded-md shadow-md border-gray-150'
					onRequestClose={() => setIsOpen(false)}
					ariaHideApp={false}
				>
					<div className='flex flex-col justify-center items-center h-[100%]'>
						{selectedFile ? (
							<img
								src={imageFileUrl}
								alt='Выбранный файл'
								className={`w-full max-h-[250px] object-cover cursor-pointer ${
									imageFileUploading ? 'animate-pulse' : ''
								}`}
								onClick={() => setSelectedFile(null)}
							/>
						) : (
							<HiCamera
								onClick={() => filePickerRef.current.click()}
								className='text-5xl text-gray-400 cursor-pointer'
							/>
						)}
						<input
							hidden
							ref={filePickerRef}
							type='file'
							accept='image/*'
							onChange={addImageToPost}
						/>
					</div>
					<input
						type='text'
						maxLength='150'
						placeholder='Введите название...'
						className='m-4 border-none text-center w-full focus:ring-0 outline-none'
					/>
					<button className='w-full bg-red-600 text-white p-2 shadow-md rounded-lg hover:brightness-105 disabled:bg-gray-200 disabled:cursor-not-allowed disabled:hover:brightness-100'>
						Загрузить картинку
					</button>
					<AiOutlineClose
						className='cursor-pointer absolute top-2 right-2 hover:text-red-600 transition duration-300'
						onClick={() => setIsOpen(false)}
					/>
				</Modal>
			)}
		</header>
	);
};

export default Header;
