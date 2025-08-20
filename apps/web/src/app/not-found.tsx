export default function NotFound() {
	return (
		<div className="h-screen flex flex-col items-center justify-center text-center bg-white text-black dark:bg-black dark:text-white font-sans">
			<div>
				<h1 className=" inline-block mr-5 pr-6 text-2xl font-light align-top leading-[49px] border-r border-black/30 dark:border-white/30">
					404
				</h1>
				<div className="inline-block">
					<h2 className="text-sm font-light leading-[49px] m-0">
						This page could not be found.
					</h2>
				</div>
			</div>
		</div>
	);
}
