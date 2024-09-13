import Toast from "react-native-toast-message";
interface ToastProps {
  text1?: string;
  text2?: string;
}
export const ToastSuscess = (props: ToastProps) => {
  return Toast.show({
    type: "success",
    text1: props.text1,
    text2: props.text2,
  });
};
export const ToastError = (props: ToastProps) => {
  return Toast.show({
    type: "error",
    text1: props.text1,
    text2: props.text2,
  });
};
