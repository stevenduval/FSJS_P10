const ValidationErrors = ({ errors }) => {
    return (
        errors.length ? (
            <div className="validation--errors">
                <h3>Validation Errors</h3>
                <ul>
                    {errors.map((error, index) => <li key={index}>{error}</li>)}
                </ul>
            </div>
        ) : null
    )
}

export default ValidationErrors;