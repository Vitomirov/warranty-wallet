import React, { useEffect, useState } from 'react'; // Import React and hooks
import axios from 'axios'; // Import axios for HTTP requests
import { useParams, Link } from 'react-router-dom'; // Import routing utilities
import DeleteWarranty from './DeleteWarranty'; // Import component for deleting warranties

const WarrantyDetails = () => {
  const [warranty, setWarranty] = useState(null); // State for storing warranty details
  const [error, setError] = useState(null); // State for storing error messages
  const { id } = useParams(); // Get warranty ID from URL parameters
  const token = localStorage.getItem('accessToken'); // Retrieve access token from local storage
  
  // Effect to fetch warranty details when the component mounts or ID changes
  useEffect(() => {
    const fetchWarranty = async () => {
      if (!id) {
        setError('Invalid warranty ID'); // Set error if ID is invalid
        return;
      }
      try {
        const response = await axios.get(`http://localhost:3000/warranties/details/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}` // Include token in the request header
          }
        });
        setWarranty(response.data); // Update state with fetched warranty data
      } catch (err) {
        console.error('There was an error fetching the warranty details!', err);
        setError('There was an error fetching the warranty details!'); // Set error if request fails
      }
    };

    fetchWarranty(); // Call the function to fetch warranty details
  }, [id, token]); // Dependencies: re-run when ID or token changes

  // Function to handle downloading the warranty PDF
  const handleDownloadPDF = async () => {
    const pdfFileName = warranty.pdfFilePath.split('/').pop(); // Get the file name from the path
    const accessToken = localStorage.getItem('accessToken'); // Retrieve token again

    try {
      const response = await axios.get(`http://localhost:3000/uploads/${pdfFileName}`, {
        headers: {
          Authorization: `Bearer ${accessToken}` // Include token in the request header
        },
        responseType: 'blob' // Set response type to blob for file download
      });

      const url = window.URL.createObjectURL(new Blob([response.data])); // Create a URL for the downloaded file
      const link = document.createElement('a'); // Create a link element
      link.href = url; // Set the link's href to the blob URL
      link.setAttribute('download', pdfFileName); // Set the download attribute to the file name
      document.body.appendChild(link); // Append the link to the body
      link.click(); // Programmatically click the link to trigger download
      link.remove(); // Remove the link from the document
    } catch (error) {
      console.error('Error downloading file:', error); // Log error if download fails
    }
  };

  // Render error message if there is an error
  if (error) {
    return <div>{error}</div>;
  }

  // Render loading state while warranty data is being fetched
  if (!warranty) {
    return <div>Loading...</div>;
  }

  // Render the warranty details and actions
  return (
    <>
      <h1>Warranty Details</h1>
      <p>Product Name: {warranty.productName}</p>
      <p>Date of Purchase: {warranty.dateOfPurchase}</p>
      <p>Warranty Expire Date: {warranty.warrantyExpireDate}</p>
      <p>
        <Link onClick={handleDownloadPDF}>Download PDF</Link> 
      </p>
      <DeleteWarranty id={warranty.warrantyId}/>
      <br />
      <Link to='/myWarranties'>Back</Link> 
      <br />
      <Link to="/">Home</Link> 
    </>
  );
};

export default WarrantyDetails; // Export the component
