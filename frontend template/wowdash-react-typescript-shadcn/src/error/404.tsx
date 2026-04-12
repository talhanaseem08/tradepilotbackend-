import ErrorImage from '@/assets/images/error-img.png';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="">
            <div className="card basic-data-table border-0 overflow-hidden">
                <div className="card-body py-10 lg:py-[60px] xl:py-[80px] px-8 text-center">
                    <img src={ErrorImage} alt="Error Image" className="mb-6 mx-auto" />
                        <h6 className="mb-4">Page not Found</h6>
                        <p className="text-secondary-light">Sorry, the page you are looking for doesn't exist </p>
                        <Button asChild className='px-10 h-12 mt-6'>
                            <Link to="/dashboard"> Back to Home </Link>
                        </Button>
                </div>
            </div>
        </div>
    );
};

export default NotFound;