import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import ImageGallery from './ImageGallery';
import Searchbar from './Searchbar';
import Button from './Button';
import Modal from './Modal';
import Loader from './Loader';

import * as API from './services/api';

const STATUS = {
  idle: 'idle',
  pending: 'pending',
  resolved: 'resolved',
  rejected: 'rejected',
};

export const App = () => {
  const [searchValue, setSearchValue] = useState('');
  const [page, setPage] = useState(1);
  const [response, setResponse] = useState([]);
  const [status, setStatus] = useState(STATUS.idle);
  const [showModal, setShowModal] = useState(false);
  const [largeImg, setLargeImg] = useState(null);
  const [showLoadMore, setShowLoadMore] = useState(false);

  useEffect(() => {
    if (searchValue === '') {
      return;
    }

    async function fetchData() {
      try {
        const { hits, totalHits } = await API.getImage(searchValue, page);
        if (!hits.length) {
          throw new Error(`not found`);
        }
        if (Math.round(totalHits / 12) === page) {
          setShowLoadMore(false);
          toast.error(`THAT IT!`);
          return;
        }
        setShowLoadMore(true);
        setResponse(prev => [...prev, ...hits]);
        setStatus(STATUS.resolved);
      } catch (error) {
        setStatus(STATUS.rejected);
      }
    }
    fetchData();
  }, [page, searchValue]);

  const toggleModal = largeImg => {
    setShowModal(prev => !prev);
    setLargeImg(largeImg);
  };

  const onChange = value => {
    setSearchValue(value);
    setPage(1);
    setResponse([]);
  };

  // const onClick = () => {

  // };

  return (
    <div>
      {showModal && (
        <Modal onClose={toggleModal}>
          <img src={largeImg} alt="" />
        </Modal>
      )}

      <Searchbar onSubmit={onChange}></Searchbar>

      {status === 'idle' && ''}

      {status === 'pending' && <Loader></Loader>}

      {status === 'resolved' && (
        <>
          <ImageGallery
            response={response}
            toggleModal={toggleModal}
          ></ImageGallery>
          {showLoadMore && (
            <Button
              onClick={() => {
                setPage(prev => prev + 1);
              }}
            ></Button>
          )}
        </>
      )}

      {status === 'rejected' && (
        <div>
          <Toaster position="top-center" reverseOrder={false} />
          {toast.error(`${searchValue} not found!`)}
        </div>
      )}
    </div>
  );
};
