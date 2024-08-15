import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./ProductForm.module.css";
import { toast } from "react-toastify";
import { addProductApiAsync } from "../../../redux/productReducer/productReducer";
import { useDispatch, useSelector } from "react-redux";
import { loadingSelector } from "../../../redux/loaderReducer/loaderReducer";

export default function ProductForm() {
    const { loading } = useSelector(loadingSelector);
    const dispatch = useDispatch();
    const [formFields, setFormFields] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        brand: "",
        images: []
    });

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "images") {
            setFormFields((prevState) => ({
                ...prevState,
                [name]: [...prevState.images, ...Array.from(files)]
            }));
        } else {
            setFormFields({ ...formFields, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        for (const field in formFields) {
            if (field !== "images" && !formFields[field]) {
                toast.error(`Please fill out the ${field} field.`);
                return;
            }
        }

        const formData = new FormData();
        for (const key in formFields) {
            if (key === "images") {
                formFields.images.forEach(file => {
                    formData.append("images", file);
                });
            } else {
                formData.append(key, formFields[key]);
            }
        }

        try {
           
           const res = await dispatch(addProductApiAsync(formData));
           if(res.payload){
                clearInput();
                toast.success("Product is added successfully.");
           }
            
        } catch (error) {
            console.error("There was an error uploading the product:", error);
        }
    };

    // Clear input fields when form is submitted
    const clearInput = () => {
        setFormFields({
            name: "",
            description: "",
            price: "",
            stock: "",
            category: "",
            brand: "",
            images: []
        });
        // Reset file input manually
        document.querySelector('input[name="images"]').value = "";
    };


    if(loading){
        return <h1>Loading..................</h1>
    }

    return (
        <div className={styles.productFormPageContainer}>
            <form className={styles.productForm} onSubmit={handleSubmit}>
                <h3>Add New Products</h3>
                {["name", "description", "price", "stock", "category", "brand"].map((field) => (
                    <div key={field} className={styles.formControlDiv}>
                        <input
                            type={field === "price" || field === "stock" ? "number" : "text"}
                            name={field}
                            value={formFields[field]}
                            onChange={handleInputChange}
                            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                        />
                    </div>
                ))}
                <div className={styles.formControlDiv}>
                    <input
                        type="file"
                        name="images"
                        multiple
                        onChange={handleInputChange}
                    />
                </div>
                <button type="submit" className={styles.submitButton}>Submit</button>
            </form>

           
        </div>
    );
}
