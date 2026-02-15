import * as React from "react"

const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
    ({ className, ...props }, ref) => (
        <div style={{ position: 'relative' }}>
            <select
                ref={ref}
                className={`select ${className || ''}`}
                {...props}
            />
        </div>
    )
)
Select.displayName = "Select"

export { Select }
