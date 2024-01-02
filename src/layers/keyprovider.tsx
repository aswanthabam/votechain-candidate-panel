// import React, { useEffect } from "react";
// import { useDialog } from "../hooks/useDialog";
// import { useLocation, useNavigate } from "react-router-dom";
// // import { useKey } from "../hooks/useKey";
// import { useWeb3 } from "../hooks/useWeb3";

// interface KeyProviderProps {
//   children: string | JSX.Element | JSX.Element[] | (() => JSX.Element);
// }

// export const KeyProvider: React.FC<KeyProviderProps> = ({ children }) => {
//   const { setDialog, showDialog } = useDialog();
//   const redirect = useNavigate();
//   const { key, setKey } = useKey();
//   const { web3 } = useWeb3();
//   const location = useLocation();
//   useEffect(() => {
//     var _key = localStorage.getItem("private_key");
//     console.log("Key: ", _key);
//     if (!_key) {
//       setDialog(
//         <h1>
//           You are not logged in, Please login to continue. If you are already
//           logged in, please refresh the page.
//         </h1>
//       );
//       showDialog();
//       redirect("/login");
//     } else {
//       console.log("Set KEY!");
//       setKey(key);
//       web3 && web3.eth.accounts.wallet.add(key as string);
//     }
//     //eslint-disable-next-line
//   }, [location.pathname, web3]);
//   // useEffect(() => {
//   //   console.log("KEY CHANGE!", key);
//   //   if (key) {
//   //     console.log("Wallet loaded ....");
//   //   } else {
//   //     console.log("Wallet NOT loaded ....");
//   //   }
//   // });
//   return <>{children}</>;
// };
export default {};
