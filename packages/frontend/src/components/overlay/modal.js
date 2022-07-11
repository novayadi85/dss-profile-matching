
import classNames from "classnames";


const Modal = (props) => {
  const { open, children } = props
  return (
    <div id="delete-modal-preview"
      className={classNames(
        "modal overflow-y-auto mt-0 pl-0 ml-0 z-50",
        open ? "show" : "",
      )}
      tabIndex="-1" aria-hidden="false"
      // style="margin-top: 0px; margin-left: 0px; padding-left: 0px; z-index: 10000;"
      style={{ zIndex: 10000 }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>
  )
};
export default Modal

export function ModalDelete(props) {

  const { open, setOpen, onConfirm } = props

  return (
    <Modal
      open={open}
    >
      <div className="modal-body p-0">
        <div className="p-5 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x-circle w-16 h-16 text-theme-6 mx-auto mt-3"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
          <div className="text-3xl mt-5">Are you sure?</div>
          <div className="text-gray-600 mt-2">
            Do you really want to delete these records?
            <br />
            This process cannot be undone.
          </div>
        </div>
        <div className="px-5 pb-8 text-center">
          <button
            type="button"
            className="btn btn-outline-secondary w-24 dark:border-dark-5 dark:text-gray-300 mr-1"
            onClick={() => setOpen(false)}
          >Cancel</button>
          <button
            type="button"
            className="btn btn-danger w-24"
            onClick={() => onConfirm()}
          >Delete
          </button>
        </div>
      </div>
    </Modal>
  )
}


