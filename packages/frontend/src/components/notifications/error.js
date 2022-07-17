export const message = (props) => {
    const { open, children } = props
    return (
        <div style={{display: 'none'}}>
            <div id="success-notification-content" className="toastify-content d-none d-flex">
                <i className="text-theme-9" data-feather="check-circle"></i> 
                <div className="ms-4 me-4">
                    <div className="fw-medium">Message Saved!</div>
                    <div className="text-gray-600 mt-1">The message will be sent in 5 minutes.</div>
                </div>
            </div>
        </div>
    )
}

