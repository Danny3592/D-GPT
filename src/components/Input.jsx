const Input = ({ label, name }) => {
  return (
    <>
      <div className="flex gap-2 items-center">
        <label htmlFor={name} className="font-bold text-4xl text-[#eeeeee]">
          {label} :
        </label>
        <input
          id={name}
          className="bg-[#bbd8dc] font-bold text-2xl pl-3 py-2 rounded-lg  focus:placeholder-transparent"
          placeholder={`請輸入${label}`}
        />
      </div>
    </>
  );
};

export default Input;
