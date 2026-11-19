import LoadingIndicator from './LoadingIndicator'

const PreLoader = () => {
  return (
    <div className='fixed w-full h-screen flex justify-center items-center'>
      <LoadingIndicator label="Loading profile" />

    </div>
  )
}

export default PreLoader
