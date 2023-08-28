// import React from 'react'

// const Loader = () => {
//     return (
//         <div>  <div id="preloader">
//             <div className="lds-ripple">
//                 <div />
//                 <div />
//             </div>
//         </div></div>
//     )
// }

// export default Loader



import { applyMiddleware } from '@reduxjs/toolkit'
import React from 'react'
// import "../App.css"
function Loader() {
    return (

            <div class="loader">
            <div class="loader__image">
                <div class="loader__coin">
                    <img src="https://www.dropbox.com/s/fzc3fidyxqbqhnj/loader-coin.png?raw=1" alt="" />
                </div>
                <div class="loader__hand">
                    <img src="https://www.dropbox.com/s/y8uqvjn811z6npu/loader-hand.png?raw=1" alt="" />
                </div>
        </div></div>
    )
}

export default Loader