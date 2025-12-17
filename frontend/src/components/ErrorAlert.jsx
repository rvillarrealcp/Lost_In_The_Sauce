const ErrorAlert = ({ message }) => {
    if (!message) return null;
    return <div className='alert alert-error mb-4'>{message}</div>;
};

export default ErrorAlert;