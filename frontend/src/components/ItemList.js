import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const ItemList = () => {
    const [items, setItems] = useState([]);
    const [form, setForm] = useState({ name: '', description: '' });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/items');
            setItems(res.data);
        } catch (error) {
            console.error("Error fetching items:", error);
            alert("Failed to fetch items.");
        }
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        if (editingId) {
            await axios.put(`http://localhost:5000/api/items/${editingId}`, form);
            Swal.fire({
                icon: 'success',
                title: 'Updated!',
                text: 'Item has been updated successfully.',
                timer: 1500,
                showConfirmButton: false
            });
            setEditingId(null);
        } else {
            await axios.post('http://localhost:5000/api/items', form);
            Swal.fire({
                icon: 'success',
                title: 'Added!',
                text: 'New item has been added successfully.',
                timer: 1500,
                showConfirmButton: false
            });
        }
        setForm({ name: '', description: '' });
        fetchItems();
    } catch (error) {
        console.error("Error submitting form:", error);
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.response?.data?.error || 'Something went wrong!',
        });
    }
};

    const handleEdit = (item) => {
    setForm({ name: item.name, description: item.description });
    setEditingId(item._id);

    Swal.fire({
        icon: 'info',
        title: 'Edit Mode Activated',
        text: `You are now editing: "${item.name}"`,
        timer: 1500,
        showConfirmButton: false
    });
};


    const handleDelete = async (id) => {
    const result = await Swal.fire({
        title: 'Are you sure?',
        text: "Do you really want to delete this item? This action cannot be undone!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
        try {
            await axios.delete(`http://localhost:5000/api/items/${id}`);
            fetchItems();
            Swal.fire(
                'Deleted!',
                'Your item has been deleted.',
                'success'
            );
        } catch (error) {
            console.error("Error deleting item:", error);
            Swal.fire(
                'Error!',
                'Failed to delete the item.',
                'error'
            );
        }
    }
};


    return (
        <div className="App">
            <h2>CRUD App</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    required
                />
                <button type="submit">{editingId ? 'Update' : 'Add'} Item</button>
            </form>

            <ul>
                {items.map((item) => (
                    <li key={item._id}>
                        <div>
                            <strong>{item.name}</strong>
                            <span>{item.description}</span>
                        </div>
                        <div>
                            <button className="edit-btn" onClick={() => handleEdit(item)}>Edit</button>
                            <button className="delete-btn" onClick={() => handleDelete(item._id)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ItemList;

