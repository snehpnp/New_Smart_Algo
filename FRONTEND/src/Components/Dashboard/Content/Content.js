import React from 'react'

const Content = ({ Page_title, ...rest }) => {
  console.log("res", rest);
  return (
    <div>
      <div className="content-body">
        <div className="container-fluid">
          <div className="row">
            <div className="col-xl-12">
              <div className="mt-5 mb-4">
                <div className="d-flex align-items-center justify-content-between mb-sm-0 mb-2">
                  <h2 className="font-w500">{Page_title}</h2>
                </div>
              </div>

              <div className="row">
                <div className="col-xl-12">
                  <div className="card">
                    <div className="card-header border-0 pb-0 flex-wrap">
                      <div className="card-body">
                        {rest.children}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div></div>
  )
}

export default Content






// import React from 'react'


// const Content = () => {
//   return (
//     <div><div className="content-body">
//       {/* row */}
//       <div className="container-fluid">

//         {/* --------theme-1-dashboard start---------- */}
//         <div className='theme-1-dashboard'>
//           <div className="row">
//             <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">
//               <div className="income-data d-flex align-items-center justify-content-xl-start justify-content-between mb-xl-0 mb-3">
//                 <span className=" income-icon style-1 me-4">
//                   <svg
//                     width={30}
//                     height={30}
//                     viewBox="0 0 30 30"
//                     fill="none"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path
//                       d="M20.4764 0.97345C20.4255 0.974639 20.3747 0.978331 20.3241 0.984696C19.9555 1.02962 19.6167 1.20961 19.3732 1.48989C19.1297 1.77018 18.9988 2.13096 19.0057 2.50219V29.4991C19.0077 29.8041 19.1026 30.1012 19.2778 30.3509C19.453 30.6006 19.7001 30.7909 19.9862 30.8966C20.2723 31.0022 20.5838 31.0183 20.8792 30.9424C21.1746 30.8665 21.4398 30.7023 21.6395 30.4718L30.6425 19.9748C30.7704 19.8249 30.8676 19.6513 30.9284 19.4639C30.9893 19.2765 31.0126 19.079 30.9971 18.8825C30.9816 18.6861 30.9276 18.4946 30.8381 18.319C30.7486 18.1435 30.6254 17.9875 30.4755 17.8595C30.3257 17.7316 30.1521 17.6344 29.9647 17.5735C29.7773 17.5127 29.5797 17.4893 29.3833 17.5048C29.1869 17.5204 28.9954 17.5745 28.8199 17.664C28.6443 17.7535 28.4882 17.8766 28.3602 18.0265L21.994 25.4444V2.50219C21.9976 2.30152 21.9608 2.10206 21.8859 1.91585C21.811 1.72965 21.6995 1.56043 21.5579 1.41809C21.4164 1.27576 21.2478 1.16328 21.062 1.08729C20.8763 1.01131 20.6771 0.973336 20.4764 0.975699L20.4764 0.97345ZM11.453 1.00736C11.2441 1.01319 11.0388 1.0627 10.8501 1.15252C10.6614 1.24234 10.4935 1.37054 10.3573 1.52899L1.3661 12.026C1.22021 12.1722 1.10608 12.3469 1.03084 12.5392C0.955604 12.7315 0.920883 12.9374 0.928852 13.1437C0.936821 13.3501 0.98731 13.5526 1.07716 13.7385C1.167 13.9245 1.29427 14.0897 1.45099 14.2242C1.60771 14.3587 1.79051 14.4595 1.98794 14.52C2.18537 14.5806 2.39318 14.5997 2.59835 14.5763C2.80352 14.5528 3.00163 14.4871 3.18029 14.3835C3.35895 14.2799 3.51429 14.1407 3.6366 13.9743L10.0028 6.55623V29.4988C9.99838 29.6986 10.0339 29.8972 10.1073 30.0831C10.1807 30.2689 10.2905 30.4383 10.4302 30.5812C10.5699 30.724 10.7368 30.8374 10.921 30.9149C11.1052 30.9924 11.303 31.0324 11.5028 31.0324C11.7026 31.0324 11.9005 30.9924 12.0847 30.9149C12.2689 30.8374 12.4357 30.724 12.5754 30.5812C12.7152 30.4383 12.8249 30.2689 12.8983 30.0831C12.9717 29.8972 13.0072 29.6986 13.0028 29.4988V2.50167C13.0021 2.30093 12.9611 2.10237 12.8823 1.91775C12.8035 1.73314 12.6884 1.56607 12.5439 1.42674C12.3993 1.28741 12.2283 1.17853 12.041 1.1065C11.8536 1.03447 11.6536 1.00089 11.453 1.00753V1.00736Z"
//                       fill="#fff"
//                     />
//                   </svg>
//                 </span>
//                 <div>
//                   <h2 className="font-w600 mb-0 income-value">$45,945</h2>
//                   <span className=" fs-6 font-w500">Total incomes</span>
//                 </div>
//               </div>
//             </div>
//             <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">
//               <div className="income-data d-flex align-items-center justify-content-xl-start justify-content-between mb-xl-0 mb-3">
//                 <span className=" income-icon style-1 me-4">
//                   <svg
//                     width={30}
//                     height={30}
//                     viewBox="0 0 30 30"
//                     fill="none"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path
//                       d="M20.4764 0.97345C20.4255 0.974639 20.3747 0.978331 20.3241 0.984696C19.9555 1.02962 19.6167 1.20961 19.3732 1.48989C19.1297 1.77018 18.9988 2.13096 19.0057 2.50219V29.4991C19.0077 29.8041 19.1026 30.1012 19.2778 30.3509C19.453 30.6006 19.7001 30.7909 19.9862 30.8966C20.2723 31.0022 20.5838 31.0183 20.8792 30.9424C21.1746 30.8665 21.4398 30.7023 21.6395 30.4718L30.6425 19.9748C30.7704 19.8249 30.8676 19.6513 30.9284 19.4639C30.9893 19.2765 31.0126 19.079 30.9971 18.8825C30.9816 18.6861 30.9276 18.4946 30.8381 18.319C30.7486 18.1435 30.6254 17.9875 30.4755 17.8595C30.3257 17.7316 30.1521 17.6344 29.9647 17.5735C29.7773 17.5127 29.5797 17.4893 29.3833 17.5048C29.1869 17.5204 28.9954 17.5745 28.8199 17.664C28.6443 17.7535 28.4882 17.8766 28.3602 18.0265L21.994 25.4444V2.50219C21.9976 2.30152 21.9608 2.10206 21.8859 1.91585C21.811 1.72965 21.6995 1.56043 21.5579 1.41809C21.4164 1.27576 21.2478 1.16328 21.062 1.08729C20.8763 1.01131 20.6771 0.973336 20.4764 0.975699L20.4764 0.97345ZM11.453 1.00736C11.2441 1.01319 11.0388 1.0627 10.8501 1.15252C10.6614 1.24234 10.4935 1.37054 10.3573 1.52899L1.3661 12.026C1.22021 12.1722 1.10608 12.3469 1.03084 12.5392C0.955604 12.7315 0.920883 12.9374 0.928852 13.1437C0.936821 13.3501 0.98731 13.5526 1.07716 13.7385C1.167 13.9245 1.29427 14.0897 1.45099 14.2242C1.60771 14.3587 1.79051 14.4595 1.98794 14.52C2.18537 14.5806 2.39318 14.5997 2.59835 14.5763C2.80352 14.5528 3.00163 14.4871 3.18029 14.3835C3.35895 14.2799 3.51429 14.1407 3.6366 13.9743L10.0028 6.55623V29.4988C9.99838 29.6986 10.0339 29.8972 10.1073 30.0831C10.1807 30.2689 10.2905 30.4383 10.4302 30.5812C10.5699 30.724 10.7368 30.8374 10.921 30.9149C11.1052 30.9924 11.303 31.0324 11.5028 31.0324C11.7026 31.0324 11.9005 30.9924 12.0847 30.9149C12.2689 30.8374 12.4357 30.724 12.5754 30.5812C12.7152 30.4383 12.8249 30.2689 12.8983 30.0831C12.9717 29.8972 13.0072 29.6986 13.0028 29.4988V2.50167C13.0021 2.30093 12.9611 2.10237 12.8823 1.91775C12.8035 1.73314 12.6884 1.56607 12.5439 1.42674C12.3993 1.28741 12.2283 1.17853 12.041 1.1065C11.8536 1.03447 11.6536 1.00089 11.453 1.00753V1.00736Z"
//                       fill="#fff"
//                     />
//                   </svg>
//                 </span>
//                 <div>
//                   <h2 className="font-w600 mb-0 income-value">$45,945</h2>
//                   <span className=" fs-6 font-w500">Total incomes</span>
//                 </div>
//               </div>
//             </div>

//             <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">
//               <div className="income-data d-flex align-items-center justify-content-xl-start justify-content-between mb-xl-0 mb-3">
//                 <span className=" income-icon style-1 me-4">
//                   <svg
//                     width={30}
//                     height={30}
//                     viewBox="0 0 30 30"
//                     fill="none"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path
//                       d="M20.4764 0.97345C20.4255 0.974639 20.3747 0.978331 20.3241 0.984696C19.9555 1.02962 19.6167 1.20961 19.3732 1.48989C19.1297 1.77018 18.9988 2.13096 19.0057 2.50219V29.4991C19.0077 29.8041 19.1026 30.1012 19.2778 30.3509C19.453 30.6006 19.7001 30.7909 19.9862 30.8966C20.2723 31.0022 20.5838 31.0183 20.8792 30.9424C21.1746 30.8665 21.4398 30.7023 21.6395 30.4718L30.6425 19.9748C30.7704 19.8249 30.8676 19.6513 30.9284 19.4639C30.9893 19.2765 31.0126 19.079 30.9971 18.8825C30.9816 18.6861 30.9276 18.4946 30.8381 18.319C30.7486 18.1435 30.6254 17.9875 30.4755 17.8595C30.3257 17.7316 30.1521 17.6344 29.9647 17.5735C29.7773 17.5127 29.5797 17.4893 29.3833 17.5048C29.1869 17.5204 28.9954 17.5745 28.8199 17.664C28.6443 17.7535 28.4882 17.8766 28.3602 18.0265L21.994 25.4444V2.50219C21.9976 2.30152 21.9608 2.10206 21.8859 1.91585C21.811 1.72965 21.6995 1.56043 21.5579 1.41809C21.4164 1.27576 21.2478 1.16328 21.062 1.08729C20.8763 1.01131 20.6771 0.973336 20.4764 0.975699L20.4764 0.97345ZM11.453 1.00736C11.2441 1.01319 11.0388 1.0627 10.8501 1.15252C10.6614 1.24234 10.4935 1.37054 10.3573 1.52899L1.3661 12.026C1.22021 12.1722 1.10608 12.3469 1.03084 12.5392C0.955604 12.7315 0.920883 12.9374 0.928852 13.1437C0.936821 13.3501 0.98731 13.5526 1.07716 13.7385C1.167 13.9245 1.29427 14.0897 1.45099 14.2242C1.60771 14.3587 1.79051 14.4595 1.98794 14.52C2.18537 14.5806 2.39318 14.5997 2.59835 14.5763C2.80352 14.5528 3.00163 14.4871 3.18029 14.3835C3.35895 14.2799 3.51429 14.1407 3.6366 13.9743L10.0028 6.55623V29.4988C9.99838 29.6986 10.0339 29.8972 10.1073 30.0831C10.1807 30.2689 10.2905 30.4383 10.4302 30.5812C10.5699 30.724 10.7368 30.8374 10.921 30.9149C11.1052 30.9924 11.303 31.0324 11.5028 31.0324C11.7026 31.0324 11.9005 30.9924 12.0847 30.9149C12.2689 30.8374 12.4357 30.724 12.5754 30.5812C12.7152 30.4383 12.8249 30.2689 12.8983 30.0831C12.9717 29.8972 13.0072 29.6986 13.0028 29.4988V2.50167C13.0021 2.30093 12.9611 2.10237 12.8823 1.91775C12.8035 1.73314 12.6884 1.56607 12.5439 1.42674C12.3993 1.28741 12.2283 1.17853 12.041 1.1065C11.8536 1.03447 11.6536 1.00089 11.453 1.00753V1.00736Z"
//                       fill="#fff"
//                     />
//                   </svg>
//                 </span>
//                 <div>
//                   <h2 className="font-w600 mb-0 income-value">$45,945</h2>
//                   <span className=" fs-6 font-w500">Total incomes</span>
//                 </div>
//               </div>
//             </div>
//             <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">
//               <div className="income-data d-flex align-items-center justify-content-xl-start justify-content-between mb-xl-0 mb-3">
//                 <span className=" income-icon style-1 me-4">
//                   <svg
//                     width={30}
//                     height={30}
//                     viewBox="0 0 30 30"
//                     fill="none"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path
//                       d="M20.4764 0.97345C20.4255 0.974639 20.3747 0.978331 20.3241 0.984696C19.9555 1.02962 19.6167 1.20961 19.3732 1.48989C19.1297 1.77018 18.9988 2.13096 19.0057 2.50219V29.4991C19.0077 29.8041 19.1026 30.1012 19.2778 30.3509C19.453 30.6006 19.7001 30.7909 19.9862 30.8966C20.2723 31.0022 20.5838 31.0183 20.8792 30.9424C21.1746 30.8665 21.4398 30.7023 21.6395 30.4718L30.6425 19.9748C30.7704 19.8249 30.8676 19.6513 30.9284 19.4639C30.9893 19.2765 31.0126 19.079 30.9971 18.8825C30.9816 18.6861 30.9276 18.4946 30.8381 18.319C30.7486 18.1435 30.6254 17.9875 30.4755 17.8595C30.3257 17.7316 30.1521 17.6344 29.9647 17.5735C29.7773 17.5127 29.5797 17.4893 29.3833 17.5048C29.1869 17.5204 28.9954 17.5745 28.8199 17.664C28.6443 17.7535 28.4882 17.8766 28.3602 18.0265L21.994 25.4444V2.50219C21.9976 2.30152 21.9608 2.10206 21.8859 1.91585C21.811 1.72965 21.6995 1.56043 21.5579 1.41809C21.4164 1.27576 21.2478 1.16328 21.062 1.08729C20.8763 1.01131 20.6771 0.973336 20.4764 0.975699L20.4764 0.97345ZM11.453 1.00736C11.2441 1.01319 11.0388 1.0627 10.8501 1.15252C10.6614 1.24234 10.4935 1.37054 10.3573 1.52899L1.3661 12.026C1.22021 12.1722 1.10608 12.3469 1.03084 12.5392C0.955604 12.7315 0.920883 12.9374 0.928852 13.1437C0.936821 13.3501 0.98731 13.5526 1.07716 13.7385C1.167 13.9245 1.29427 14.0897 1.45099 14.2242C1.60771 14.3587 1.79051 14.4595 1.98794 14.52C2.18537 14.5806 2.39318 14.5997 2.59835 14.5763C2.80352 14.5528 3.00163 14.4871 3.18029 14.3835C3.35895 14.2799 3.51429 14.1407 3.6366 13.9743L10.0028 6.55623V29.4988C9.99838 29.6986 10.0339 29.8972 10.1073 30.0831C10.1807 30.2689 10.2905 30.4383 10.4302 30.5812C10.5699 30.724 10.7368 30.8374 10.921 30.9149C11.1052 30.9924 11.303 31.0324 11.5028 31.0324C11.7026 31.0324 11.9005 30.9924 12.0847 30.9149C12.2689 30.8374 12.4357 30.724 12.5754 30.5812C12.7152 30.4383 12.8249 30.2689 12.8983 30.0831C12.9717 29.8972 13.0072 29.6986 13.0028 29.4988V2.50167C13.0021 2.30093 12.9611 2.10237 12.8823 1.91775C12.8035 1.73314 12.6884 1.56607 12.5439 1.42674C12.3993 1.28741 12.2283 1.17853 12.041 1.1065C11.8536 1.03447 11.6536 1.00089 11.453 1.00753V1.00736Z"
//                       fill="#fff"
//                     />
//                   </svg>
//                 </span>
//                 <div>
//                   <h2 className="font-w600 mb-0 income-value">$45,945</h2>
//                   <span className=" fs-6 font-w500">Total incomes</span>
//                 </div>
//               </div>
//             </div>
//             <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">
//               <div className="income-data d-flex align-items-center justify-content-xl-start justify-content-between mb-xl-0 mb-3">
//                 <span className=" income-icon style-1 me-4">
//                   <svg
//                     width={30}
//                     height={30}
//                     viewBox="0 0 30 30"
//                     fill="none"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path
//                       d="M20.4764 0.97345C20.4255 0.974639 20.3747 0.978331 20.3241 0.984696C19.9555 1.02962 19.6167 1.20961 19.3732 1.48989C19.1297 1.77018 18.9988 2.13096 19.0057 2.50219V29.4991C19.0077 29.8041 19.1026 30.1012 19.2778 30.3509C19.453 30.6006 19.7001 30.7909 19.9862 30.8966C20.2723 31.0022 20.5838 31.0183 20.8792 30.9424C21.1746 30.8665 21.4398 30.7023 21.6395 30.4718L30.6425 19.9748C30.7704 19.8249 30.8676 19.6513 30.9284 19.4639C30.9893 19.2765 31.0126 19.079 30.9971 18.8825C30.9816 18.6861 30.9276 18.4946 30.8381 18.319C30.7486 18.1435 30.6254 17.9875 30.4755 17.8595C30.3257 17.7316 30.1521 17.6344 29.9647 17.5735C29.7773 17.5127 29.5797 17.4893 29.3833 17.5048C29.1869 17.5204 28.9954 17.5745 28.8199 17.664C28.6443 17.7535 28.4882 17.8766 28.3602 18.0265L21.994 25.4444V2.50219C21.9976 2.30152 21.9608 2.10206 21.8859 1.91585C21.811 1.72965 21.6995 1.56043 21.5579 1.41809C21.4164 1.27576 21.2478 1.16328 21.062 1.08729C20.8763 1.01131 20.6771 0.973336 20.4764 0.975699L20.4764 0.97345ZM11.453 1.00736C11.2441 1.01319 11.0388 1.0627 10.8501 1.15252C10.6614 1.24234 10.4935 1.37054 10.3573 1.52899L1.3661 12.026C1.22021 12.1722 1.10608 12.3469 1.03084 12.5392C0.955604 12.7315 0.920883 12.9374 0.928852 13.1437C0.936821 13.3501 0.98731 13.5526 1.07716 13.7385C1.167 13.9245 1.29427 14.0897 1.45099 14.2242C1.60771 14.3587 1.79051 14.4595 1.98794 14.52C2.18537 14.5806 2.39318 14.5997 2.59835 14.5763C2.80352 14.5528 3.00163 14.4871 3.18029 14.3835C3.35895 14.2799 3.51429 14.1407 3.6366 13.9743L10.0028 6.55623V29.4988C9.99838 29.6986 10.0339 29.8972 10.1073 30.0831C10.1807 30.2689 10.2905 30.4383 10.4302 30.5812C10.5699 30.724 10.7368 30.8374 10.921 30.9149C11.1052 30.9924 11.303 31.0324 11.5028 31.0324C11.7026 31.0324 11.9005 30.9924 12.0847 30.9149C12.2689 30.8374 12.4357 30.724 12.5754 30.5812C12.7152 30.4383 12.8249 30.2689 12.8983 30.0831C12.9717 29.8972 13.0072 29.6986 13.0028 29.4988V2.50167C13.0021 2.30093 12.9611 2.10237 12.8823 1.91775C12.8035 1.73314 12.6884 1.56607 12.5439 1.42674C12.3993 1.28741 12.2283 1.17853 12.041 1.1065C11.8536 1.03447 11.6536 1.00089 11.453 1.00753V1.00736Z"
//                       fill="#fff"
//                     />
//                   </svg>
//                 </span>
//                 <div>
//                   <h2 className="font-w600 mb-0 income-value">$45,945</h2>
//                   <span className=" fs-6 font-w500">Total incomes</span>
//                 </div>
//               </div>
//             </div>
//             <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">
//               <div className="income-data d-flex align-items-center justify-content-xl-start justify-content-between mb-xl-0 mb-3">
//                 <span className=" income-icon style-1 me-4">
//                   <svg
//                     width={30}
//                     height={30}
//                     viewBox="0 0 30 30"
//                     fill="none"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path
//                       d="M20.4764 0.97345C20.4255 0.974639 20.3747 0.978331 20.3241 0.984696C19.9555 1.02962 19.6167 1.20961 19.3732 1.48989C19.1297 1.77018 18.9988 2.13096 19.0057 2.50219V29.4991C19.0077 29.8041 19.1026 30.1012 19.2778 30.3509C19.453 30.6006 19.7001 30.7909 19.9862 30.8966C20.2723 31.0022 20.5838 31.0183 20.8792 30.9424C21.1746 30.8665 21.4398 30.7023 21.6395 30.4718L30.6425 19.9748C30.7704 19.8249 30.8676 19.6513 30.9284 19.4639C30.9893 19.2765 31.0126 19.079 30.9971 18.8825C30.9816 18.6861 30.9276 18.4946 30.8381 18.319C30.7486 18.1435 30.6254 17.9875 30.4755 17.8595C30.3257 17.7316 30.1521 17.6344 29.9647 17.5735C29.7773 17.5127 29.5797 17.4893 29.3833 17.5048C29.1869 17.5204 28.9954 17.5745 28.8199 17.664C28.6443 17.7535 28.4882 17.8766 28.3602 18.0265L21.994 25.4444V2.50219C21.9976 2.30152 21.9608 2.10206 21.8859 1.91585C21.811 1.72965 21.6995 1.56043 21.5579 1.41809C21.4164 1.27576 21.2478 1.16328 21.062 1.08729C20.8763 1.01131 20.6771 0.973336 20.4764 0.975699L20.4764 0.97345ZM11.453 1.00736C11.2441 1.01319 11.0388 1.0627 10.8501 1.15252C10.6614 1.24234 10.4935 1.37054 10.3573 1.52899L1.3661 12.026C1.22021 12.1722 1.10608 12.3469 1.03084 12.5392C0.955604 12.7315 0.920883 12.9374 0.928852 13.1437C0.936821 13.3501 0.98731 13.5526 1.07716 13.7385C1.167 13.9245 1.29427 14.0897 1.45099 14.2242C1.60771 14.3587 1.79051 14.4595 1.98794 14.52C2.18537 14.5806 2.39318 14.5997 2.59835 14.5763C2.80352 14.5528 3.00163 14.4871 3.18029 14.3835C3.35895 14.2799 3.51429 14.1407 3.6366 13.9743L10.0028 6.55623V29.4988C9.99838 29.6986 10.0339 29.8972 10.1073 30.0831C10.1807 30.2689 10.2905 30.4383 10.4302 30.5812C10.5699 30.724 10.7368 30.8374 10.921 30.9149C11.1052 30.9924 11.303 31.0324 11.5028 31.0324C11.7026 31.0324 11.9005 30.9924 12.0847 30.9149C12.2689 30.8374 12.4357 30.724 12.5754 30.5812C12.7152 30.4383 12.8249 30.2689 12.8983 30.0831C12.9717 29.8972 13.0072 29.6986 13.0028 29.4988V2.50167C13.0021 2.30093 12.9611 2.10237 12.8823 1.91775C12.8035 1.73314 12.6884 1.56607 12.5439 1.42674C12.3993 1.28741 12.2283 1.17853 12.041 1.1065C11.8536 1.03447 11.6536 1.00089 11.453 1.00753V1.00736Z"
//                       fill="#fff"
//                     />
//                   </svg>
//                 </span>
//                 <div>
//                   <h2 className="font-w600 mb-0 income-value">$45,945</h2>
//                   <span className=" fs-6 font-w500">Total incomes</span>
//                 </div>
//               </div>
//             </div>
//             <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">
//               <div className="income-data d-flex align-items-center justify-content-xl-start justify-content-between mb-xl-0 mb-3">
//                 <span className=" income-icon style-1 me-4">
//                   <svg
//                     width={30}
//                     height={30}
//                     viewBox="0 0 30 30"
//                     fill="none"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path
//                       d="M20.4764 0.97345C20.4255 0.974639 20.3747 0.978331 20.3241 0.984696C19.9555 1.02962 19.6167 1.20961 19.3732 1.48989C19.1297 1.77018 18.9988 2.13096 19.0057 2.50219V29.4991C19.0077 29.8041 19.1026 30.1012 19.2778 30.3509C19.453 30.6006 19.7001 30.7909 19.9862 30.8966C20.2723 31.0022 20.5838 31.0183 20.8792 30.9424C21.1746 30.8665 21.4398 30.7023 21.6395 30.4718L30.6425 19.9748C30.7704 19.8249 30.8676 19.6513 30.9284 19.4639C30.9893 19.2765 31.0126 19.079 30.9971 18.8825C30.9816 18.6861 30.9276 18.4946 30.8381 18.319C30.7486 18.1435 30.6254 17.9875 30.4755 17.8595C30.3257 17.7316 30.1521 17.6344 29.9647 17.5735C29.7773 17.5127 29.5797 17.4893 29.3833 17.5048C29.1869 17.5204 28.9954 17.5745 28.8199 17.664C28.6443 17.7535 28.4882 17.8766 28.3602 18.0265L21.994 25.4444V2.50219C21.9976 2.30152 21.9608 2.10206 21.8859 1.91585C21.811 1.72965 21.6995 1.56043 21.5579 1.41809C21.4164 1.27576 21.2478 1.16328 21.062 1.08729C20.8763 1.01131 20.6771 0.973336 20.4764 0.975699L20.4764 0.97345ZM11.453 1.00736C11.2441 1.01319 11.0388 1.0627 10.8501 1.15252C10.6614 1.24234 10.4935 1.37054 10.3573 1.52899L1.3661 12.026C1.22021 12.1722 1.10608 12.3469 1.03084 12.5392C0.955604 12.7315 0.920883 12.9374 0.928852 13.1437C0.936821 13.3501 0.98731 13.5526 1.07716 13.7385C1.167 13.9245 1.29427 14.0897 1.45099 14.2242C1.60771 14.3587 1.79051 14.4595 1.98794 14.52C2.18537 14.5806 2.39318 14.5997 2.59835 14.5763C2.80352 14.5528 3.00163 14.4871 3.18029 14.3835C3.35895 14.2799 3.51429 14.1407 3.6366 13.9743L10.0028 6.55623V29.4988C9.99838 29.6986 10.0339 29.8972 10.1073 30.0831C10.1807 30.2689 10.2905 30.4383 10.4302 30.5812C10.5699 30.724 10.7368 30.8374 10.921 30.9149C11.1052 30.9924 11.303 31.0324 11.5028 31.0324C11.7026 31.0324 11.9005 30.9924 12.0847 30.9149C12.2689 30.8374 12.4357 30.724 12.5754 30.5812C12.7152 30.4383 12.8249 30.2689 12.8983 30.0831C12.9717 29.8972 13.0072 29.6986 13.0028 29.4988V2.50167C13.0021 2.30093 12.9611 2.10237 12.8823 1.91775C12.8035 1.73314 12.6884 1.56607 12.5439 1.42674C12.3993 1.28741 12.2283 1.17853 12.041 1.1065C11.8536 1.03447 11.6536 1.00089 11.453 1.00753V1.00736Z"
//                       fill="#fff"
//                     />
//                   </svg>
//                 </span>
//                 <div>
//                   <h2 className="font-w600 mb-0 income-value">$45,945</h2>
//                   <span className=" fs-6 font-w500">Total incomes</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         {/* --------theme-1-dashboard end---------- */}

//         {/* --------theme-2-dashboard start---------- */}
//         <div className='theme-2-dashboard'>
//           <div className='row'>
//             <div className="col-xl-4 col-lg-4 col-xxl-4 col-sm-6">
//               <div className="rounded bg-primary overflow-hidden second-dash-card">
//                 <div className="card-body pb-0">
//                   <div className="row">
//                     <div className="col">
//                       <h2 className="text-white">Power</h2>
//                       {/* <span className="text-white">2017.1.20</span> */}
//                     </div>
//                     <div className="col text-end">
//                       <h2 className="text-white">
//                         260
//                       </h2>
//                       {/* <span className="text-white">+12.5(2.8%)</span> */}
//                     </div>
//                   </div>
//                 </div>
//                 <div className="chart-wrapper">
//                   <img src='../assets/images/dash_icon/bar.png' className='w-100' />
//                 </div>
//               </div>
//             </div>
//             <div className="col-xl-4 col-lg-4 col-xxl-4 col-sm-6">
//               <div className="rounded bg-primary overflow-hidden second-dash-card">
//                 <div className="card-body pb-0">
//                   <div className="row">
//                     <div className="col">
//                       <h2 className="text-white">Power</h2>
//                       {/* <span className="text-white">2017.1.20</span> */}
//                     </div>
//                     <div className="col text-end">
//                       <h2 className="text-white">
//                         260
//                       </h2>
//                       {/* <span className="text-white">+12.5(2.8%)</span> */}
//                     </div>
//                   </div>
//                 </div>
//                 <div className="chart-wrapper">
//                   <img src='../assets/images/dash_icon/bar.png' className='w-100' />
//                 </div>
//               </div>
//             </div>
//             <div className="col-xl-4 col-lg-4 col-xxl-4 col-sm-6">
//               <div className="rounded bg-primary overflow-hidden second-dash-card">
//                 <div className="card-body pb-0">
//                   <div className="row">
//                     <div className="col">
//                       <h2 className="text-white">Power</h2>
//                       {/* <span className="text-white">2017.1.20</span> */}
//                     </div>
//                     <div className="col text-end">
//                       <h2 className="text-white">
//                         260
//                       </h2>
//                       {/* <span className="text-white">+12.5(2.8%)</span> */}
//                     </div>
//                   </div>
//                 </div>
//                 <div className="chart-wrapper">
//                   <img src='../assets/images/dash_icon/bar.png' className='w-100' />
//                 </div>
//               </div>
//             </div>
//             <div className="col-xl-4 col-lg-4 col-xxl-4 col-sm-6">
//               <div className="rounded bg-primary overflow-hidden second-dash-card">
//                 <div className="card-body pb-0">
//                   <div className="row">
//                     <div className="col">
//                       <h2 className="text-white">Power</h2>
//                       {/* <span className="text-white">2017.1.20</span> */}
//                     </div>
//                     <div className="col text-end">
//                       <h2 className="text-white">
//                         260
//                       </h2>
//                       {/* <span className="text-white">+12.5(2.8%)</span> */}
//                     </div>
//                   </div>
//                 </div>
//                 <div className="chart-wrapper">
//                   <img src='../assets/images/dash_icon/bar.png' className='w-100' />
//                 </div>
//               </div>
//             </div>
//             <div className="col-xl-4 col-lg-4 col-xxl-4 col-sm-6">
//               <div className="rounded bg-primary overflow-hidden second-dash-card">
//                 <div className="card-body pb-0">
//                   <div className="row">
//                     <div className="col">
//                       <h2 className="text-white">Power</h2>
//                       {/* <span className="text-white">2017.1.20</span> */}
//                     </div>
//                     <div className="col text-end">
//                       <h2 className="text-white">
//                         260
//                       </h2>
//                       {/* <span className="text-white">+12.5(2.8%)</span> */}
//                     </div>
//                   </div>
//                 </div>
//                 <div className="chart-wrapper">
//                   <img src='../assets/images/dash_icon/bar.png' className='w-100' />
//                 </div>
//               </div>
//             </div>
//             <div className="col-xl-4 col-lg-4 col-xxl-4 col-sm-6">
//               <div className="rounded bg-primary overflow-hidden second-dash-card">
//                 <div className="card-body pb-0">
//                   <div className="row">
//                     <div className="col">
//                       <h2 className="text-white">Power</h2>
//                       {/* <span className="text-white">2017.1.20</span> */}
//                     </div>
//                     <div className="col text-end">
//                       <h2 className="text-white">
//                         260
//                       </h2>
//                       {/* <span className="text-white">+12.5(2.8%)</span> */}
//                     </div>
//                   </div>
//                 </div>
//                 <div className="chart-wrapper">
//                   <img src='../assets/images/dash_icon/bar.png' className='w-100' />
//                 </div>
//               </div>
//             </div>
//             <div className="col-xl-4 col-lg-4 col-xxl-4 col-sm-6">
//               <div className="rounded bg-primary overflow-hidden second-dash-card">
//                 <div className="card-body pb-0">
//                   <div className="row">
//                     <div className="col">
//                       <h2 className="text-white">Power</h2>
//                       {/* <span className="text-white">2017.1.20</span> */}
//                     </div>
//                     <div className="col text-end">
//                       <h2 className="text-white">
//                         260
//                       </h2>
//                       {/* <span className="text-white">+12.5(2.8%)</span> */}
//                     </div>
//                   </div>
//                 </div>
//                 <div className="chart-wrapper">
//                   <img src='../assets/images/dash_icon/bar.png' className='w-100' />
//                 </div>
//               </div>
//             </div>

//           </div>
//         </div>
//         {/* --------theme-2-dashboard end---------- */}

//         {/* --------theme-3-dashboard start---------- */}
//         <div className='theme-3-dashboard'>
//           <div className='row'>
//             <div className="col-xl-4 col-lg-4 col-xxl-4 col-md-6">
//               <div className="card">
//                 <div className="card-header border-0 pb-0">
//                   <div className="clearfix">
//                     <h3 className="card-title">Total Account</h3>

//                   </div>
//                   <div className="clearfix text-center">
//                     <h3 className="text-primary mb-0">120/89</h3>

//                   </div>
//                 </div>
//                 <div className="pb-1 text-center">
//                   <img src='../assets/images/dash_icon/theme_3.png' className='w-100' />
//                 </div>
//               </div>
//             </div>
//             <div className="col-xl-4 col-lg-4 col-xxl-4 col-md-6">
//               <div className="card">
//                 <div className="card-header border-0 pb-0">
//                   <div className="clearfix">
//                     <h3 className="card-title">Total Account</h3>

//                   </div>
//                   <div className="clearfix text-center">
//                     <h3 className="text-primary mb-0">120/89</h3>

//                   </div>
//                 </div>
//                 <div className="pb-1 text-center">
//                   <img src='../assets/images/dash_icon/theme_3.png' className='w-100' />
//                 </div>
//               </div>
//             </div>
//             <div className="col-xl-4 col-lg-4 col-xxl-4 col-md-6">
//               <div className="card">
//                 <div className="card-header border-0 pb-0">
//                   <div className="clearfix">
//                     <h3 className="card-title">Total Account</h3>

//                   </div>
//                   <div className="clearfix text-center">
//                     <h3 className="text-primary mb-0">120/89</h3>

//                   </div>
//                 </div>
//                 <div className="pb-1 text-center">
//                   <img src='../assets/images/dash_icon/theme_3.png' className='w-100' />
//                 </div>
//               </div>
//             </div>
//             <div className="col-xl-4 col-lg-4 col-xxl-4 col-md-6">
//               <div className="card">
//                 <div className="card-header border-0 pb-0">
//                   <div className="clearfix">
//                     <h3 className="card-title">Total Account</h3>

//                   </div>
//                   <div className="clearfix text-center">
//                     <h3 className="text-primary mb-0">120/89</h3>

//                   </div>
//                 </div>
//                 <div className="pb-1 text-center">
//                   <img src='../assets/images/dash_icon/theme_3.png' className='w-100' />
//                 </div>
//               </div>
//             </div>
//             <div className="col-xl-4 col-lg-4 col-xxl-4 col-md-6">
//               <div className="card">
//                 <div className="card-header border-0 pb-0">
//                   <div className="clearfix">
//                     <h3 className="card-title">Total Account</h3>

//                   </div>
//                   <div className="clearfix text-center">
//                     <h3 className="text-primary mb-0">120/89</h3>

//                   </div>
//                 </div>
//                 <div className="pb-1 text-center">
//                   <img src='../assets/images/dash_icon/theme_3.png' className='w-100' />
//                 </div>
//               </div>
//             </div>
//             <div className="col-xl-4 col-lg-4 col-xxl-4 col-md-6">
//               <div className="card">
//                 <div className="card-header border-0 pb-0">
//                   <div className="clearfix">
//                     <h3 className="card-title">Total Account</h3>

//                   </div>
//                   <div className="clearfix text-center">
//                     <h3 className="text-primary mb-0">120/89</h3>

//                   </div>
//                 </div>
//                 <div className="pb-1 text-center">
//                   <img src='../assets/images/dash_icon/theme_3.png' className='w-100' />
//                 </div>
//               </div>
//             </div>



//           </div>

//         </div>
//         {/* --------theme-3-dashboard end---------- */}

//         {/* --------theme-4-dashboard start---------- */}
//         <div className='theme-4-dashboard'>
//           <div className='row'>
//             <div className="col-xl-3 col-lg-3 col-xxl-3 col-sm-6">
//               <div className="card fourth-dashboard-card">
//                 <div className="card-body">
//                   <div className="row justify-content-center align-items-center">
//                     <div className="col-auto text-center">
//                       <h2 className="text-uppercase">74,206</h2>
//                       <h6>Lifetime earnings</h6>
//                     </div>
//                     <div className="col-auto text-center">
//                       <img src='../assets/images/dash_icon/wave-sound.png' className='w-50' />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="col-xl-3 col-lg-3 col-xxl-3 col-sm-6">
//               <div className="card fourth-dashboard-card">
//                 <div className="card-body">
//                   <div className="row justify-content-center align-items-center">
//                     <div className="col-auto text-center">
//                       <h2 className="text-uppercase">74,206</h2>
//                       <h6>Lifetime earnings</h6>
//                     </div>
//                     <div className="col-auto text-center">
//                       <img src='../assets/images/dash_icon/wave-sound.png' className='w-50' />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="col-xl-3 col-lg-3 col-xxl-3 col-sm-6">
//               <div className="card fourth-dashboard-card">
//                 <div className="card-body">
//                   <div className="row justify-content-center align-items-center">
//                     <div className="col-auto text-center">
//                       <h2 className="text-uppercase">74,206</h2>
//                       <h6>Lifetime earnings</h6>
//                     </div>
//                     <div className="col-auto text-center">
//                       <img src='../assets/images/dash_icon/wave-sound.png' className='w-50' />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="col-xl-3 col-lg-3 col-xxl-3 col-sm-6">
//               <div className="card fourth-dashboard-card">
//                 <div className="card-body">
//                   <div className="row justify-content-center align-items-center">
//                     <div className="col-auto text-center">
//                       <h2 className="text-uppercase">74,206</h2>
//                       <h6>Lifetime earnings</h6>
//                     </div>
//                     <div className="col-auto text-center">
//                       <img src='../assets/images/dash_icon/wave-sound.png' className='w-50' />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="col-xl-3 col-lg-3 col-xxl-3 col-sm-6">
//               <div className="card fourth-dashboard-card">
//                 <div className="card-body">
//                   <div className="row justify-content-center align-items-center">
//                     <div className="col-auto text-center">
//                       <h2 className="text-uppercase">74,206</h2>
//                       <h6>Lifetime earnings</h6>
//                     </div>
//                     <div className="col-auto text-center">
//                       <img src='../assets/images/dash_icon/wave-sound.png' className='w-50' />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="col-xl-3 col-lg-3 col-xxl-3 col-sm-6">
//               <div className="card fourth-dashboard-card">
//                 <div className="card-body">
//                   <div className="row justify-content-center align-items-center">
//                     <div className="col-auto text-center">
//                       <h2 className="text-uppercase">74,206</h2>
//                       <h6>Lifetime earnings</h6>
//                     </div>
//                     <div className="col-auto text-center">
//                       <img src='../assets/images/dash_icon/wave-sound.png' className='w-50' />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="col-xl-3 col-lg-3 col-xxl-3 col-sm-6">
//               <div className="card fourth-dashboard-card">
//                 <div className="card-body">
//                   <div className="row justify-content-center align-items-center">
//                     <div className="col-auto text-center">
//                       <h2 className="text-uppercase">74,206</h2>
//                       <h6>Lifetime earnings</h6>
//                     </div>
//                     <div className="col-auto text-center">
//                       <img src='../assets/images/dash_icon/wave-sound.png' className='w-50' />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="col-xl-3 col-lg-3 col-xxl-3 col-sm-6">
//               <div className="card fourth-dashboard-card">
//                 <div className="card-body">
//                   <div className="row justify-content-center align-items-center">
//                     <div className="col-auto text-center">
//                       <h2 className="text-uppercase">74,206</h2>
//                       <h6>Lifetime earnings</h6>
//                     </div>
//                     <div className="col-auto text-center">
//                       <img src='../assets/images/dash_icon/wave-sound.png' className='w-50' />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         {/* --------theme-4-dashboard end---------- */}

//         {/* --------theme-5-dashboard start---------- */}
//         <div className='theme-5-dashboard'>
//           <div className='row'>
//             <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">
//               <div className="card booking mb-0 fifth-dahbaord-card">
//                 <div className="card-body">
//                   <div className="income-data d-flex justify-content-between align-items-center mb-sm-0 mb-2  mb-sm-0 mb-2 ps-lg-0 ">
//                     <div>
//                       <h3 className="font-w600 fs-2 mb-0">195</h3>
//                       <span className="fs-6 font-w500">Rooms</span>
//                     </div>
//                     <span className="income-icon style-3">
//                       <img src='../assets/images/dash_icon/analyze.gif' className='w-100' />
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">
//               <div className="card booking mb-0 fifth-dahbaord-card">
//                 <div className="card-body">
//                   <div className="income-data d-flex justify-content-between align-items-center mb-sm-0 mb-2  mb-sm-0 mb-2 ps-lg-0 ">
//                     <div>
//                       <h3 className="font-w600 fs-2 mb-0">195</h3>
//                       <span className="fs-6 font-w500">Rooms</span>
//                     </div>
//                     <span className="income-icon style-3">
//                       <img src='../assets/images/dash_icon/analyze.gif' className='w-100' />
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">
//               <div className="card booking mb-0 fifth-dahbaord-card">
//                 <div className="card-body">
//                   <div className="income-data d-flex justify-content-between align-items-center mb-sm-0 mb-2  mb-sm-0 mb-2 ps-lg-0 ">
//                     <div>
//                       <h3 className="font-w600 fs-2 mb-0">195</h3>
//                       <span className="fs-6 font-w500">Rooms</span>
//                     </div>
//                     <span className="income-icon style-3">
//                       <img src='../assets/images/dash_icon/analyze.gif' className='w-100' />
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">
//               <div className="card booking mb-0 fifth-dahbaord-card">
//                 <div className="card-body">
//                   <div className="income-data d-flex justify-content-between align-items-center mb-sm-0 mb-2  mb-sm-0 mb-2 ps-lg-0 ">
//                     <div>
//                       <h3 className="font-w600 fs-2 mb-0">195</h3>
//                       <span className="fs-6 font-w500">Rooms</span>
//                     </div>
//                     <span className="income-icon style-3">
//                       <img src='../assets/images/dash_icon/analyze.gif' className='w-100' />
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">
//               <div className="card booking mb-0 fifth-dahbaord-card">
//                 <div className="card-body">
//                   <div className="income-data d-flex justify-content-between align-items-center mb-sm-0 mb-2  mb-sm-0 mb-2 ps-lg-0 ">
//                     <div>
//                       <h3 className="font-w600 fs-2 mb-0">195</h3>
//                       <span className="fs-6 font-w500">Rooms</span>
//                     </div>
//                     <span className="income-icon style-3">
//                       <img src='../assets/images/dash_icon/analyze.gif' className='w-100' />
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">
//               <div className="card booking mb-0 fifth-dahbaord-card">
//                 <div className="card-body">
//                   <div className="income-data d-flex justify-content-between align-items-center mb-sm-0 mb-2  mb-sm-0 mb-2 ps-lg-0 ">
//                     <div>
//                       <h3 className="font-w600 fs-2 mb-0">195</h3>
//                       <span className="fs-6 font-w500">Rooms</span>
//                     </div>
//                     <span className="income-icon style-3">
//                       <img src='../assets/images/dash_icon/analyze.gif' className='w-100' />
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">
//               <div className="card booking mb-0 fifth-dahbaord-card">
//                 <div className="card-body">
//                   <div className="income-data d-flex justify-content-between align-items-center mb-sm-0 mb-2  mb-sm-0 mb-2 ps-lg-0 ">
//                     <div>
//                       <h3 className="font-w600 fs-2 mb-0">195</h3>
//                       <span className="fs-6 font-w500">Rooms</span>
//                     </div>
//                     <span className="income-icon style-3">
//                       <img src='../assets/images/dash_icon/analyze.gif' className='w-100' />
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">
//               <div className="card booking mb-0 fifth-dahbaord-card">
//                 <div className="card-body">
//                   <div className="income-data d-flex justify-content-between align-items-center mb-sm-0 mb-2  mb-sm-0 mb-2 ps-lg-0 ">
//                     <div>
//                       <h3 className="font-w600 fs-2 mb-0">195</h3>
//                       <span className="fs-6 font-w500">Rooms</span>
//                     </div>
//                     <span className="income-icon style-3">
//                       <img src='../assets/images/dash_icon/analyze.gif' className='w-100' />
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         {/* --------theme-5-dashboard end--------- */}
//         <div className='theme-6-dashboard'>
//           <div className='row'>
//             <div className="col-xl-4 col-xxl-4 col-lg-4 col-sm-6">
//               <div className="widget-stat card  sixth-dashboard-card">
//                 <div className="card-body  p-4">
//                   <div className="media">
//                     <span className="me-3 bg-primary">
//                       <i className="la la-users  text-white" />
//                     </span>
//                     <div className="media-body ">
//                       <p className="mb-1">Total Students</p>
//                       <h3 className="">3280</h3>
//                       <div className="progress mb-2 bg-primary"></div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="col-xl-4 col-xxl-4 col-lg-4 col-sm-6">
//               <div className="widget-stat card  sixth-dashboard-card">
//                 <div className="card-body  p-4">
//                   <div className="media">
//                     <span className="me-3 bg-primary">
//                       <i className="la la-users  text-white" />
//                     </span>
//                     <div className="media-body ">
//                       <p className="mb-1">Total Students</p>
//                       <h3 className="">3280</h3>
//                       <div className="progress mb-2 bg-primary"></div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="col-xl-4 col-xxl-4 col-lg-4 col-sm-6">
//               <div className="widget-stat card  sixth-dashboard-card">
//                 <div className="card-body  p-4">
//                   <div className="media">
//                     <span className="me-3 bg-primary">
//                       <i className="la la-users  text-white" />
//                     </span>
//                     <div className="media-body ">
//                       <p className="mb-1">Total Students</p>
//                       <h3 className="">3280</h3>
//                       <div className="progress mb-2 bg-primary"></div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="col-xl-4 col-xxl-4 col-lg-4 col-sm-6">
//               <div className="widget-stat card  sixth-dashboard-card">
//                 <div className="card-body  p-4">
//                   <div className="media">
//                     <span className="me-3 bg-primary">
//                       <i className="la la-users  text-white" />
//                     </span>
//                     <div className="media-body ">
//                       <p className="mb-1">Total Students</p>
//                       <h3 className="">3280</h3>
//                       <div className="progress mb-2 bg-primary"></div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="col-xl-4 col-xxl-4 col-lg-4 col-sm-6">
//               <div className="widget-stat card  sixth-dashboard-card">
//                 <div className="card-body  p-4">
//                   <div className="media">
//                     <span className="me-3 bg-primary">
//                       <i className="la la-users  text-white" />
//                     </span>
//                     <div className="media-body ">
//                       <p className="mb-1">Total Students</p>
//                       <h3 className="">3280</h3>
//                       <div className="progress mb-2 bg-primary"></div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="col-xl-4 col-xxl-4 col-lg-4 col-sm-6">
//               <div className="widget-stat card  sixth-dashboard-card">
//                 <div className="card-body  p-4">
//                   <div className="media">
//                     <span className="me-3 bg-primary">
//                       <i className="la la-users  text-white" />
//                     </span>
//                     <div className="media-body ">
//                       <p className="mb-1">Total Students</p>
//                       <h3 className="">3280</h3>
//                       <div className="progress mb-2 bg-primary"></div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="col-xl-4 col-xxl-4 col-lg-4 col-sm-6">
//               <div className="widget-stat card  sixth-dashboard-card">
//                 <div className="card-body  p-4">
//                   <div className="media">
//                     <span className="me-3 bg-primary">
//                       <i className="la la-users  text-white" />
//                     </span>
//                     <div className="media-body ">
//                       <p className="mb-1">Total Students</p>
//                       <h3 className="">3280</h3>
//                       <div className="progress mb-2 bg-primary"></div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="col-xl-4 col-xxl-4 col-lg-4 col-sm-6">
//               <div className="widget-stat card  sixth-dashboard-card">
//                 <div className="card-body  p-4">
//                   <div className="media">
//                     <span className="me-3 bg-primary">
//                       <i className="la la-users  text-white" />
//                     </span>
//                     <div className="media-body ">
//                       <p className="mb-1">Total Students</p>
//                       <h3 className="">3280</h3>
//                       <div className="progress mb-2 bg-primary"></div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className='theme-7-dashboard'>
//           <div className='row'>
//             <div className="col-xl-4 col-lg-4 col-sm-6">
//               <div className="card overflow-hidden">
//                 <div className="card-body">
//                   <div className="text-center">
//                     <div className="profile-photo">
//                       <img
//                         src="../assets/images/profile/profile.png"
//                         width={100}
//                         className="img-fluid rounded-circle"
//                         alt=""
//                       />
//                     </div>
//                     <h3 className="mt-4 mb-1">Deangelo Sena</h3>
//                     <p className="text-muted">Senior Manager</p>
//                     <a
//                       className="btn btn-outline-primary btn-rounded mt-3 px-5"
//                       href="javascript:void();"
//                     >
//                       Profile
//                     </a>
//                   </div>
//                 </div>

//               </div>
//             </div>
//             <div className="col-xl-8 col-lg-8 col-xxl-8 col-md-8">
//               <div className='row'>
//                 <div className="col-xl-4 col-lg-4 col-xxl-4 col-md-4">
//                   <div className="card">
//                     <div className="card-header border-0 pb-0">
//                       <div className="clearfix">
//                         <h3 className="card-title">Clolesterol</h3>

//                       </div>
//                       <div className="clearfix text-center">
//                         <h3 className="text-info mb-0">124</h3>

//                       </div>
//                     </div>
//                     <div className="card-body text-center">
//                       <img src='../assets/images/dash_icon/theme-7.png' className='w-100' />
//                     </div>
//                   </div>
//                 </div>
//                 <div className="col-xl-4 col-lg-4 col-xxl-4 col-md-4">
//                   <div className="card">
//                     <div className="card-header border-0 pb-0">
//                       <div className="clearfix">
//                         <h3 className="card-title">Clolesterol</h3>

//                       </div>
//                       <div className="clearfix text-center">
//                         <h3 className="text-info mb-0">124</h3>

//                       </div>
//                     </div>
//                     <div className="card-body text-center">
//                       <img src='../assets/images/dash_icon/theme-7.png' className='w-100' />
//                     </div>
//                   </div>
//                 </div>
//                 <div className="col-xl-4 col-lg-4 col-xxl-4 col-md-4">
//                   <div className="card">
//                     <div className="card-header border-0 pb-0">
//                       <div className="clearfix">
//                         <h3 className="card-title">Clolesterol</h3>

//                       </div>
//                       <div className="clearfix text-center">
//                         <h3 className="text-info mb-0">124</h3>

//                       </div>
//                     </div>
//                     <div className="card-body text-center">
//                       <img src='../assets/images/dash_icon/theme-7.png' className='w-100' />
//                     </div>
//                   </div>
//                 </div>   <div className="col-xl-4 col-lg-4 col-xxl-4 col-md-4">
//                   <div className="card">
//                     <div className="card-header border-0 pb-0">
//                       <div className="clearfix">
//                         <h3 className="card-title">Clolesterol</h3>

//                       </div>
//                       <div className="clearfix text-center">
//                         <h3 className="text-info mb-0">124</h3>

//                       </div>
//                     </div>
//                     <div className="card-body text-center">
//                       <img src='../assets/images/dash_icon/theme-7.png' className='w-100' />
//                     </div>
//                   </div>
//                 </div>   <div className="col-xl-4 col-lg-4 col-xxl-4 col-md-4">
//                   <div className="card">
//                     <div className="card-header border-0 pb-0">
//                       <div className="clearfix">
//                         <h3 className="card-title">Clolesterol</h3>

//                       </div>
//                       <div className="clearfix text-center">
//                         <h3 className="text-info mb-0">124</h3>

//                       </div>
//                     </div>
//                     <div className="card-body text-center">
//                       <img src='../assets/images/dash_icon/theme-7.png' className='w-100' />
//                     </div>
//                   </div>
//                 </div>   <div className="col-xl-4 col-lg-4 col-xxl-4 col-md-4">
//                   <div className="card">
//                     <div className="card-header border-0 pb-0">
//                       <div className="clearfix">
//                         <h3 className="card-title">Clolesterol</h3>

//                       </div>
//                       <div className="clearfix text-center">
//                         <h3 className="text-info mb-0">124</h3>

//                       </div>
//                     </div>
//                     <div className="card-body text-center">
//                       <img src='../assets/images/dash_icon/theme-7.png' className='w-100' />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className='theme-8-dashboard'>
//           <div className='row'>
//             <div className="col-xl-3 col-xxl-4 col-lg-4 col-sm-6">
//               <div className="widget-stat card">
//                 <div className="card-body p-4">
//                   <h4 className="card-title">Fees Collection</h4>
//                   <h3>25160$</h3>
//                   <div className="progress mb-2">
//                     <div
//                       className="progress-bar progress-animated bg-success"
//                       style={{ width: "30%" }}
//                     />
//                   </div>

//                 </div>
//               </div>
//             </div>

//             <div className="col-xl-3 col-xxl-4 col-lg-4 col-sm-6">
//               <div className="widget-stat card">
//                 <div className="card-body p-4">
//                   <h4 className="card-title">Fees Collection</h4>
//                   <h3>25160$</h3>
//                   <div className="progress mb-2">
//                     <div
//                       className="progress-bar progress-animated bg-success"
//                       style={{ width: "30%" }}
//                     />
//                   </div>

//                 </div>
//               </div>
//             </div>
//             <div className="col-xl-3 col-xxl-4 col-lg-4 col-sm-6">
//               <div className="widget-stat card">
//                 <div className="card-body p-4">
//                   <h4 className="card-title">Fees Collection</h4>
//                   <h3>25160$</h3>
//                   <div className="progress mb-2">
//                     <div
//                       className="progress-bar progress-animated bg-success"
//                       style={{ width: "30%" }}
//                     />
//                   </div>

//                 </div>
//               </div>
//             </div>
//             <div className="col-xl-3 col-xxl-4 col-lg-4 col-sm-6">
//               <div className="widget-stat card">
//                 <div className="card-body p-4">
//                   <h4 className="card-title">Fees Collection</h4>
//                   <h3>25160$</h3>
//                   <div className="progress mb-2">
//                     <div
//                       className="progress-bar progress-animated bg-success"
//                       style={{ width: "30%" }}
//                     />
//                   </div>

//                 </div>
//               </div>
//             </div>
//             <div className="col-xl-3 col-xxl-4 col-lg-4 col-sm-6">
//               <div className="widget-stat card">
//                 <div className="card-body p-4">
//                   <h4 className="card-title">Fees Collection</h4>
//                   <h3>25160$</h3>
//                   <div className="progress mb-2">
//                     <div
//                       className="progress-bar progress-animated bg-success"
//                       style={{ width: "30%" }}
//                     />
//                   </div>

//                 </div>
//               </div>
//             </div>


//             <div className="col-xl-3 col-xxl-4 col-lg-4 col-sm-6">
//               <div className="widget-stat card">
//                 <div className="card-body p-4">
//                   <h4 className="card-title">Fees Collection</h4>
//                   <h3>25160$</h3>
//                   <div className="progress mb-2">
//                     <div
//                       className="progress-bar progress-animated bg-success"
//                       style={{ width: "30%" }}
//                     />
//                   </div>

//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         {/* <div className="row">
//         <div className="col-xl-12">
//           <div className="col-xl-12 card h-auto">
//             <div className="card-body">
//               <div className="row align-items-center">
//                 <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">
//                   <div className="income-data d-flex align-items-center justify-content-xl-start justify-content-between mb-xl-0 mb-3">
//                     <span className=" income-icon style-1 me-4">
//                       <svg
//                         width={30}
//                         height={30}
//                         viewBox="0 0 30 30"
//                         fill="none"
//                         xmlns="http://www.w3.org/2000/svg"
//                       >
//                         <path
//                           d="M20.4764 0.97345C20.4255 0.974639 20.3747 0.978331 20.3241 0.984696C19.9555 1.02962 19.6167 1.20961 19.3732 1.48989C19.1297 1.77018 18.9988 2.13096 19.0057 2.50219V29.4991C19.0077 29.8041 19.1026 30.1012 19.2778 30.3509C19.453 30.6006 19.7001 30.7909 19.9862 30.8966C20.2723 31.0022 20.5838 31.0183 20.8792 30.9424C21.1746 30.8665 21.4398 30.7023 21.6395 30.4718L30.6425 19.9748C30.7704 19.8249 30.8676 19.6513 30.9284 19.4639C30.9893 19.2765 31.0126 19.079 30.9971 18.8825C30.9816 18.6861 30.9276 18.4946 30.8381 18.319C30.7486 18.1435 30.6254 17.9875 30.4755 17.8595C30.3257 17.7316 30.1521 17.6344 29.9647 17.5735C29.7773 17.5127 29.5797 17.4893 29.3833 17.5048C29.1869 17.5204 28.9954 17.5745 28.8199 17.664C28.6443 17.7535 28.4882 17.8766 28.3602 18.0265L21.994 25.4444V2.50219C21.9976 2.30152 21.9608 2.10206 21.8859 1.91585C21.811 1.72965 21.6995 1.56043 21.5579 1.41809C21.4164 1.27576 21.2478 1.16328 21.062 1.08729C20.8763 1.01131 20.6771 0.973336 20.4764 0.975699L20.4764 0.97345ZM11.453 1.00736C11.2441 1.01319 11.0388 1.0627 10.8501 1.15252C10.6614 1.24234 10.4935 1.37054 10.3573 1.52899L1.3661 12.026C1.22021 12.1722 1.10608 12.3469 1.03084 12.5392C0.955604 12.7315 0.920883 12.9374 0.928852 13.1437C0.936821 13.3501 0.98731 13.5526 1.07716 13.7385C1.167 13.9245 1.29427 14.0897 1.45099 14.2242C1.60771 14.3587 1.79051 14.4595 1.98794 14.52C2.18537 14.5806 2.39318 14.5997 2.59835 14.5763C2.80352 14.5528 3.00163 14.4871 3.18029 14.3835C3.35895 14.2799 3.51429 14.1407 3.6366 13.9743L10.0028 6.55623V29.4988C9.99838 29.6986 10.0339 29.8972 10.1073 30.0831C10.1807 30.2689 10.2905 30.4383 10.4302 30.5812C10.5699 30.724 10.7368 30.8374 10.921 30.9149C11.1052 30.9924 11.303 31.0324 11.5028 31.0324C11.7026 31.0324 11.9005 30.9924 12.0847 30.9149C12.2689 30.8374 12.4357 30.724 12.5754 30.5812C12.7152 30.4383 12.8249 30.2689 12.8983 30.0831C12.9717 29.8972 13.0072 29.6986 13.0028 29.4988V2.50167C13.0021 2.30093 12.9611 2.10237 12.8823 1.91775C12.8035 1.73314 12.6884 1.56607 12.5439 1.42674C12.3993 1.28741 12.2283 1.17853 12.041 1.1065C11.8536 1.03447 11.6536 1.00089 11.453 1.00753V1.00736Z"
//                           fill="#fff"
//                         />
//                       </svg>
//                     </span>
//                     <div>
//                       <h2 className="font-w600 mb-0 income-value">$45,945</h2>
//                       <span className=" fs-6 font-w500">Total incomes</span>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">
//                   <div className="d-flex align-items-end justify-content-xl-start justify-content-between mb-xl-0 mb-3">
//                     <div id="NewCustomers" />
//                     <div className=" ms-3">
//                       <h6 className="fs-18 font-w600 mb-0 text-success">
//                         +2.4%
//                       </h6>
//                       <span className="fs-14 font-w400">Than last week</span>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">
//                   <div className="card trading mb-sm-0 mb-3">
//                     <div className="card-body">
//                       <div className="income-data d-flex justify-content-between align-items-center mb-sm-0 mb-2 ps-lg-0">
//                         <div>
//                           <h3 className="font-w600 fs-2 mb-0 text-white">
//                             845
//                           </h3>
//                           <span className="fs-6 font-w500 text-white">
//                             New Guest
//                           </span>
//                         </div>
//                         <span className="income-icon style-2">
//                           <svg
//                             width={34}
//                             height={24}
//                             viewBox="0 0 34 24"
//                             fill="none"
//                             xmlns="http://www.w3.org/2000/svg"
//                           >
//                             <path
//                               d="M33.5 22.5C33.5 22.8978 33.342 23.2793 33.0607 23.5606C32.7794 23.8419 32.3978 24 32 24H14C13.6022 24 13.2206 23.8419 12.9393 23.5606C12.658 23.2793 12.5 22.8978 12.5 22.5C12.5 20.113 13.4482 17.8238 15.136 16.136C16.8239 14.4482 19.1131 13.5 21.5 13.5H24.5C26.8869 13.5 29.1761 14.4482 30.864 16.136C32.5518 17.8238 33.5 20.113 33.5 22.5ZM23 0C21.8133 0 20.6533 0.351893 19.6666 1.01118C18.6799 1.67047 17.9108 2.60754 17.4567 3.7039C17.0026 4.80025 16.8838 6.00665 17.1153 7.17053C17.3468 8.33442 17.9182 9.40352 18.7574 10.2426C19.5965 11.0817 20.6656 11.6532 21.8295 11.8847C22.9933 12.1162 24.1997 11.9974 25.2961 11.5433C26.3925 11.0891 27.3295 10.3201 27.9888 9.33341C28.6481 8.34672 29 7.18668 29 5.99999C29 4.4087 28.3679 2.88257 27.2426 1.75736C26.1174 0.63214 24.5913 0 23 0ZM9.5 0C8.31331 0 7.15327 0.351893 6.16658 1.01118C5.17988 1.67047 4.41085 2.60754 3.95672 3.7039C3.5026 4.80025 3.38378 6.00665 3.61529 7.17053C3.8468 8.33442 4.41824 9.40352 5.25736 10.2426C6.09647 11.0817 7.16557 11.6532 8.32946 11.8847C9.49334 12.1162 10.6997 11.9974 11.7961 11.5433C12.8925 11.0891 13.8295 10.3201 14.4888 9.33341C15.1481 8.34672 15.5 7.18668 15.5 5.99999C15.5 4.4087 14.8679 2.88257 13.7426 1.75736C12.6174 0.63214 11.0913 0 9.5 0ZM9.5 22.5C9.49777 20.9244 9.80818 19.364 10.4133 17.9093C11.0183 16.4545 11.9061 15.1342 13.025 14.025C12.1093 13.6793 11.1388 13.5014 10.16 13.5H8.84C6.62931 13.504 4.5103 14.3839 2.94711 15.9471C1.38391 17.5103 0.503965 19.6293 0.5 21.84V22.5C0.5 22.8978 0.658035 23.2793 0.93934 23.5606C1.22064 23.8419 1.60218 24 2 24H9.77C9.59537 23.519 9.50406 23.0117 9.5 22.5Z"
//                               fill="#FFFFFF"
//                             />
//                           </svg>
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">
//                   <div className="card booking mb-0">
//                     <div className="card-body">
//                       <div className="income-data d-flex justify-content-between align-items-center mb-sm-0 mb-2  mb-sm-0 mb-2 ps-lg-0 ">
//                         <div>
//                           <h3 className="font-w600 fs-2 mb-0">195</h3>
//                           <span className="fs-6 font-w500">Rooms</span>
//                         </div>
//                         <span className="income-icon style-3">
//                           <svg
//                             width={28}
//                             height={28}
//                             viewBox="0 0 28 28"
//                             fill="none"
//                             xmlns="http://www.w3.org/2000/svg"
//                           >
//                             <path
//                               d="M20.0734 0C15.6988 0 12.1485 3.54844 12.1485 7.92443C12.1485 9.14474 12.4477 10.2895 12.9391 11.3213L0.516482 23.7488C-0.172161 24.4374 -0.172161 25.5504 0.516482 26.239L1.76163 27.4841C2.09101 27.8152 2.53822 28 3.00678 28C3.47341 28 3.92084 27.8152 4.25193 27.4841L7.02037 24.7158L9.551 27.2516C9.88209 27.581 10.3292 27.7658 10.7962 27.7658C11.2648 27.7658 11.7119 27.5827 12.0413 27.2516L12.6649 26.6284C13.3535 25.9398 13.3535 24.8269 12.6649 24.1382L10.1306 21.6024L16.6763 15.0566C17.7118 15.5497 18.853 15.8489 20.0751 15.8489C24.453 15.8489 28 12.3004 28 7.92443C28 3.54844 24.4533 0 20.0734 0ZM20.0734 12.3269C17.6448 12.3269 15.6706 10.3509 15.6706 7.92443C15.6706 5.49796 17.6448 3.52197 20.0734 3.52197C22.502 3.52197 24.4761 5.49796 24.4761 7.92443C24.4761 10.3509 22.502 12.3269 20.0734 12.3269Z"
//                               fill="var(--primary)"
//                             />
//                           </svg>
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>



//         </div>
//       </div> */}
//       </div>
//     </div></div>
//   )
// }

// export default Content