import { Icon, IconProps } from "@chakra-ui/react";

const IconPrint = (props: IconProps) => (
  <Icon 
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    >
    <path
      fill="currentColor"
      d="M19,8H5C3.9,8,3,8.9,3,10v6h4v4h10v-4h4v-6C21,8.9,20.1,8,19,8z M15,18H9v-4h6V18z M19,12c-0.55,0-1-0.45-1-1
        s0.45-1,1-1s1,0.45,1,1S19.55,12,19,12z M17,3H7v4h10V3z"
    />
  </Icon>
)

export default IconPrint
