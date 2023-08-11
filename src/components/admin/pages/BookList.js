import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, Card, Container, Form, Table } from 'react-bootstrap';

import axiosInstent, { pathApi } from '../../../config/axiosCustom';
import BookAdd from '../../admin/modal/BookAdd';
import BookEdit from '../../admin/modal/BookEdit';
import { AppContext } from '../../../context/contextApp';

export default function BookList() {
  const [showModal, setShowModal] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [idDanhMuc, setIdDanhMuc] = useState(undefined);
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState([]);
  const [books, setBooks] = useState([]);
  const [inputEditBook, setInputEditBook] = useState({
    bookId: 0,
    categoryId: 0,
    title: '',
    author: '',
    description: '',
    image: null,
    price: 0,
    quantity: 0,
  });
  const formik = useFormik({
    initialValues: {
      bookId: 0,
      categoryId: 0,
      title: '',
      author: '',
      description: '',
      image: null,
      price: 0,
      quantity: 0,
    },
    validationSchema: Yup.object({
      categoryId: Yup.number().notOneOf([0], 'Phải chọn danh mục'),
      title: Yup.string().required('Title không được để trống'),
      author: Yup.string().required('Author không được để trống'),
      description: Yup.string().required('Decription không được để trống'),
      image: Yup.string().nonNullable('Bạn phải chọn file'),
      price: Yup.number().min(10000, 'Phải nhập ít nhất là 10,000đ').required('Phải nhập giá'),
      quantity: Yup.number().min(1, 'Số lượng ít nhất là 1').required('Phải nhập số lượng'),
    }),
    onSubmit: (values) => {
      addButtonClick(values);
    },
  });
  const navigate = useNavigate();
  const { appContext } = useContext(AppContext);

  useEffect(() => {
    const idAdmin = window.localStorage.getItem('idAdmin');
    if (!idAdmin) {
      navigate('../../admin/login');
      Swal.fire('Bạn phải đăng nhập', '', 'info');
      return;
    }

    window.document.title = 'Book List';
    window.scrollTo(0, 0);

    axiosInstent
      .get(pathApi.categories)
      .then((response) => {
        // console.log('category:', response.data);
        setCategories(response.data);
      })
      .catch((err) => {
        console.error(err);
      });

    callApiGetAllBooks();
  }, [appContext, navigate]);

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  const handleShowModalEdit = () => {
    setShowModalEdit(true);
  };

  const handleCloseModalEdit = () => {
    setShowModalEdit(false);
  };

  // call Api Get All Books
  const callApiGetAllBooks = async () => {
    const response = await axiosInstent.get(pathApi.products);
    const dataBook = await response.data;
    // console.log('books:', dataBook);
    setBooks(dataBook);
  };

  // render options
  const renderOptions = () => {
    return (
      <>
        <option value={0}>Chọn danh mục</option>
        {categories.map((category) => (
          <option
            key={category.categoryId}
            value={category.categoryId}
          >
            {category.categoryName}
          </option>
        ))}
      </>
    );
  };

  // handle click on add button
  const addButtonClick = async (inputAddBook) => {
    // console.log(inputAddBook);
    const formDataBook = convertToFormData(inputAddBook);
    try {
      await axiosInstent.post(pathApi.products, formDataBook);
      Swal.fire('Thêm thành công', '', 'success');
      callApiGetAllBooks();
      handleCloseModal();
      formik.resetForm();
    } catch (error) {
      console.error(error);
    }
  };

  // convert to form data
  const convertToFormData = (data) => {
    const formDataBook = new FormData();
    formDataBook.append('categoryId', data.categoryId ? data.categoryId : data.category.categoryId);
    formDataBook.append('author', data.author);
    formDataBook.append('description', data.description);
    formDataBook.append('price', data.price);
    formDataBook.append('quantity', data.quantity);
    formDataBook.append('title', data.title);
    data.image && formDataBook.append('image', data.image);
    data.bookId && formDataBook.append('bookId', data.bookId);
    return formDataBook;
  };

  // show Edit Book
  const showEditBook = (book) => {
    setInputEditBook(book);
    handleShowModalEdit();
  };

  // const handle click on edit button
  const handleEditBookClick = async () => {
    // console.log('test', inputEditBook);
    const formDataBook = convertToFormData(inputEditBook);
    try {
      await axiosInstent.put(pathApi.products, formDataBook);
      Swal.fire('Cập nhật thành công', '', 'success');
      callApiGetAllBooks();
    } catch (error) {
      console.error(error);
    }
  };

  // const handle click delete button
  const handleDelete = async (id) => {
    // console.log(id);
    try {
      await axiosInstent.delete(`${pathApi.products}/${id}`);
      Swal.fire('Xoá thành công', '', 'success');
      callApiGetAllBooks();
    } catch (error) {
      console.error(error);
    }
  };

  // renders the books
  const renderBooks = () => {
    return books.length === 0 ? (
      <tr>
        <td
          className='text-center'
          colSpan={8}
        >
          Không có sách nào trong hệ thống
        </td>
      </tr>
    ) : (
      books.map((book) => {
        return (
          <tr key={book.bookId}>
            <td className='sorting_1'>{book.bookId}</td>
            <td>{book.title}</td>
            <td>{book.author}</td>
            <td className='text-center'>
              <img
                src={book.imageName}
                alt=''
                style={{ width: '50px', height: '50px' }}
              />
            </td>
            <td>{book.price}</td>
            <td>{book.quantity}</td>
            <td>
              <Button
                className='btn-icon-split btn-sm'
                onClick={() => showEditBook(book)}
              >
                <span className='icon'>
                  <i className='fas fa-pen'></i>
                </span>
                <span className='text'>Edit</span>
              </Button>
            </td>
            <td>
              <Button
                className='btn-icon-split btn-danger btn-sm'
                onClick={() => handleDelete(book.bookId)}
              >
                <span className='icon'>
                  <i className='fas fa-trash'></i>
                </span>
                <span className='text'>Delete</span>
              </Button>
            </td>
          </tr>
        );
      })
    );
  };

  // handle select categories
  const handleSelect = (event) => {
    const id = event.target.value;
    getBooksFromApi(Number(id));
    setIdDanhMuc(Number(id));
    setSearch('');
  };

  const getBooksFromApi = async (idCategory, search = '') => {
    try {
      const response =
        idCategory === 0 || idCategory === undefined
          ? await axiosInstent.get(pathApi.products, { params: { search } })
          : await axiosInstent.get(`${pathApi.products}/category/${idCategory}`, {
              params: { search },
            });
      const data = await response.data;
      // console.log(data);
      setBooks(data);
    } catch (err) {
      console.error(err);
    }
  };

  // handle click search
  const handleSearch = () => {
    // console.log(search);
    getBooksFromApi(idDanhMuc, search);
  };

  return (
    <Container fluid>
      <h1 className='h2 my-5 text-gray-800'>Books list</h1>
      <div className='card shadow mb-4'>
        <Card.Header className='py-3 d-flex'>
          <Button
            className='btn-icon-split btn-success'
            onClick={handleShowModal}
          >
            <span
              className='icon'
              style={{ paddingTop: '8px' }}
            >
              <i className='fas fa-plus' />
            </span>
            <span
              className='text'
              style={{ paddingTop: '8px' }}
            >
              Add new
            </span>
          </Button>
          <Form.Select
            className='ml-3'
            style={{ width: '200px' }}
            onChange={handleSelect}
            value={idDanhMuc} // Giá trị idDanhMuc hiện tại để chọn mặc định
          >
            {renderOptions()}
          </Form.Select>
          <Form.Control
            className='ml-3'
            style={{ width: '500px' }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Nhập từ khoá tìm kiếm ...'
          />
          <Button
            className='btn btn-info ml-3'
            onClick={handleSearch}
          >
            Tìm kiếm
          </Button>
        </Card.Header>

        <Card.Body>
          <Table className='table-sm table-bordered mx-auto'>
            <thead>
              <tr role='row'>
                <th width='100px'>Id</th>
                <th style={{ width: '40%' }}>Title</th>
                <th style={{ width: '20%' }}>Author</th>
                <th
                  className='text-center'
                  style={{ width: '10%' }}
                >
                  Image
                </th>
                <th>Price</th>
                <th>Quantity</th>
                <th
                  colSpan={2}
                  className='text-center'
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>{renderBooks()}</tbody>
          </Table>
        </Card.Body>
      </div>

      {/* modal add new category */}
      <BookAdd
        show={showModal}
        onHide={handleCloseModal}
        renderOptions={renderOptions}
        formik={formik}
      />

      {/* modal edit */}
      <BookEdit
        inputEditBook={inputEditBook}
        setInputEditBook={setInputEditBook}
        handleEditBookClick={handleEditBookClick}
        renderOptions={renderOptions}
        showEdit={showModalEdit}
        onHideEdit={handleCloseModalEdit}
      />
    </Container>
  );
}
