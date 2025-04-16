"use client"

export function CustomToggle({ id, checked, onCheckedChange, disabled = false }) {
    return (
        <div className="inline-flex items-center">
            <label htmlFor={id} className="relative cursor-pointer">
                <input
                    type="checkbox"
                    id={id}
                    className="sr-only"
                    checked={checked}
                    disabled={disabled}
                    onChange={(e) => onCheckedChange(e.target.checked)}
                />
                <div
                    className={`block w-11 h-6 rounded-full transition-colors ${checked ? "bg-(--color-accent-primary)" : "bg-gray-600"
                        }`}
                ></div>
                <div
                    className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${checked ? "transform translate-x-5" : ""
                        }`}
                ></div>
            </label>
        </div>
    )
}
