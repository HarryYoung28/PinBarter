export default function SearchBar({ value, onChange }){
    return(
        <input
            type="text"
            placeholder="Search for a pin..."
            value={value}
            data-testid="pin-search"
            onChange={onChange}
            className="
            w-full border 
            border-gray-300 
            rounded-md px-4 
            py-2 text-sm mb-6 
            focus:outline-none
            focus:ring-2
            focus:ring-disney-dark-blue
            bg-white
            text-gray-900
            "></input>
    )
}