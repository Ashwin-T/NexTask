import {TailSpin} from 'react-loader-spinner'
import './loading.css'
const Loading = () => {
    return ( 
        <div className="loading-container">
            <TailSpin ariaLabel="loading-indicator" width = '150' height = '150' color = {'crimson'} />
        </div>
     );
}
 
export default Loading;