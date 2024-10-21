
import React from 'react'

function Shoonya() {
  return (
  <>
  {/* CREATE A MODAL FULL PAGE */}
  {/* <div className="modal fade" id="fullPageModal" tabIndex={-1} role="dialog" aria-labelledby="fullPageModalLabel" aria-hidden="true"> */}
    <div className="modal-dialog modal-dialog-centered modal-fullscreen">
        <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="fullPageModalLabel">Modal Full Page</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                </div>
                <div className="modal-body">
                    <p>Modal body text goes here.</p>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" className="btn btn-primary">Understood</button>
                </div>
        </div>
    </div>
    {/* </div> */}

  
  </>
  )
}

export default Shoonya