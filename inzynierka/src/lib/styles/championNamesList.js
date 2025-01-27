export const customStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: "transparent",
    borderColor: state.isFocused ? "#f5b800" : "#f5b800",
    color: "#f5f5f5",
    fontSize: "17px",
    cursor: "pointer",
    transition: "all 150ms ease",
    boxShadow: "none",
    "&:hover": {
      borderColor: "#f5b800",
      backgroundColor: "rgba(217,217,217,0.15)",
    },
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#f5f5f5",
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: "transparent",
    border: "1px solid #f5b800",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? "#131313" : "#131313",
    color: "#f5f5f5",
    "&:hover": {
      backgroundColor: "#696969",
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#fff",
  }),
  indicatorSeparator: (provided) => ({
    ...provided,
    display: "none",
  }),
  input: (provided) => ({
    ...provided,
    color: "white",
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: "#555",
    color: "#fff",
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: "#fff",
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: "#fff",
    "&:hover": {
      backgroundColor: "#ff0000",
      color: "#fff",
    },
  }),
  menuList: (provided) => ({
    ...provided,
    "&::-webkit-scrollbar": {
      width: "8px",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#f5f5f5",
      borderRadius: "4px",
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: "#131313",
    },
  }),
};

export const customStylesDuo = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: "rgba(175, 175, 175, 0.15)",
    border: "none",
    color: "#f5f5f5",
    fontSize: "14px",
    cursor: "pointer",
    transition: "all 150ms ease",
    boxShadow: "none",
    "&:hover": {
      backgroundColor: "rgba(217,217,217,0.15)",
    },
  }),
  option: (base, state) => ({
    ...base,
    fontSize: "14px",
    backgroundColor: state.isSelected ? "#131313" : "#131313",
    color: "#f5f5f5",
    "&:hover": {
      backgroundColor: "#696969",
    },
  }),
  singleValue: (base) => ({
    ...base,
    fontSize: "14px",
  }),
  menu: (base) => ({
    ...base,
    maxHeight: 150,
    backgroundColor: "transparent",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#f5f5f5",
  }),
  indicatorSeparator: (provided) => ({
    ...provided,
    display: "none",
  }),
  input: (provided) => ({
    ...provided,
    color: "white",
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: "#555",
    color: "#fff",
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: "#fff",
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: "#fff",
    "&:hover": {
      backgroundColor: "#ff0000",
      color: "#fff",
    },
  }),
  menuList: (provided) => ({
    ...provided,
    backgroundColor: "#131313",
    "&::-webkit-scrollbar": {
      width: "8px",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#f5f5f5",
      borderRadius: "4px",
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: "#131313",
    },
  }),
};
