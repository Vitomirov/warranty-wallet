import ReactModal from "react-modal";
import Button from "../../ui/Button";
import useDeleteAccount from "../../hooks/useDeleteAccount";

function DeleteAccount() {
  const {
    showDeleteModal,
    error,
    openDeleteModal,
    closeDeleteModal,
    handleDeleteAccount,
  } = useDeleteAccount();

  return (
    <div className="ps-5">
      <Button type="button" variant="danger" onClick={openDeleteModal}>
        Delete Account
      </Button>

      <ReactModal
        isOpen={showDeleteModal}
        onRequestClose={closeDeleteModal}
        contentLabel="Delete Account Confirmation"
        className="modalWindow"
        overlayClassName="modalWindow-overlay"
        ariaHideApp={false}
      >
        <div className="container-fluid help">
          <div className="row justify-content-center">
            <div className="col-12 col-md-10 col-lg-8">
              <h4 className="text-center mb-3">
                Are you sure you want to delete your account?
              </h4>
              <p className="text-center">
                This action cannot be undone and all your warranties will be
                deleted.
              </p>
              <div className="d-flex justify-content-center gap-3">
                <Button variant="danger" onClick={handleDeleteAccount}>
                  Yes, delete my account
                </Button>
                <Button variant="secondary" onClick={closeDeleteModal}>
                  Cancel
                </Button>
              </div>
              {error && <p className="text-danger mt-2 text-center">{error}</p>}
            </div>
          </div>
        </div>
      </ReactModal>
    </div>
  );
}

export default DeleteAccount;
