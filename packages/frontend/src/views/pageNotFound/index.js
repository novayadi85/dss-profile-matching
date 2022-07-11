
import ErrorLayout from '@components/layout/errorLayout';
import ErrorIllustration from "@assets/images/error-illustration.svg"
const PageNotFound = () => {
    return <ErrorLayout>
        <div className="container">
            <div className="error-page flex flex-col lg:flex-row items-center justify-center h-screen text-center lg:text-left">
                <div className="-intro-x lg:mr-20">
                    <img alt="Rubick Tailwind HTML Admin Template" className="h-48 lg:h-auto" src={ErrorIllustration} />
                </div>
                <div className="text-white mt-10 lg:mt-0">
                    <div className="intro-x text-8xl font-medium">404</div>
                    <div className="intro-x text-xl lg:text-3xl font-medium mt-5">Oops. This page has gone missing.</div>
                    <div className="intro-x text-lg mt-3">You may have mistyped the address or the page may have moved.</div>
                    <a className="intro-x btn py-3 px-4 text-white border-white dark:border-dark-5 dark:text-gray-300 mt-10" href='/'>Back to Home</a>
                </div>
            </div>
        </div>
        <div data-url="main-dark-error-page.html" className="dark-mode-switcher cursor-pointer shadow-md fixed bottom-0 right-0 box dark:bg-dark-2 border rounded-full w-40 h-12 flex items-center justify-center z-50 mb-10 mr-10">
            <div className="mr-4 text-gray-700 dark:text-gray-300">Dark Mode</div>
            <div className="dark-mode-switcher__toggle border"></div>
        </div>
    </ErrorLayout>
}

export default PageNotFound