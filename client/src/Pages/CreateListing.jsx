import React from 'react'
import { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function CreateListing() {
   const {currentUser} = useSelector(state => state.user);
   const navigate = useNavigate();
    const [files, setFiles] = useState([]);
    const fileInputRef = useRef(null);
    const [formData, setFormData] = useState({
      imageUrls: [],
      name: '',
      description: '',
      address: '',
      type: 'rent',
      bedrooms: 1,
      bathrooms: 1,
      regularPrice: 50,
      discountPrice: 0,
      offer: false,
      parking: false,
      furnished: false,


      
    });

    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);




    console.log(formData);
    const handleImageSubmit = async () => {
      if (files.length === 0) {
        setImageUploadError('Please select at least one image to upload');
        return;
      }

      if (files.length + formData.imageUrls.length > 6) {
        setImageUploadError('You can only upload up to 6 images per listing');
        return;
      }

      // Pre-check file sizes (max 10MB per image)
      for (let i = 0; i < files.length; i++) {
        if (files[i].size > 10 * 1024 * 1024) {
          setImageUploadError(`"${files[i].name}" exceeds 10MB limit. Each image must be under 10MB.`);
          return;
        }
      }

      setUploading(true);
      setImageUploadError(false);

      try {
        const uploadFormData = new FormData();
        for (let i = 0; i < files.length; i++) {
          uploadFormData.append('images', files[i]);
        }

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        });

        const data = await res.json();

        if (data.success === false) {
          setImageUploadError(data.message || 'Image upload failed');
          setUploading(false);
          return;
        }

        setFormData({
          ...formData,
          imageUrls: formData.imageUrls.concat(data.urls),
        });
        setImageUploadError(false);
        setUploading(false);
        setFiles([]);
        if (fileInputRef.current) fileInputRef.current.value = '';
      } catch (err) {
        console.error('Image upload error:', err);
        setImageUploadError('Image upload failed: ' + (err.message || 'Server error'));
        setUploading(false);
      }
    };
     const handleRemoveImage = (index) => {
      setFormData({
         ...formData,
         imageUrls: formData.imageUrls.filter((_, i) => i !== index),
      });
     }
      const handleChange = (e) => {
         if(e.target.id === 'sale' || e.target.id === 'rent'){
            setFormData({
               ...formData,
               type: e.target.id
            })
         }

         if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
            setFormData({
               ...formData,
               [e.target.id]: e.target.checked
            })
         }

          if(e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea'){
            setFormData({
               ...formData,
               [e.target.id]: e.target.value
            })
          }

      };

         const handleSubmit = async (e) => {
            e.preventDefault();
            try {
               if (!currentUser) return setError('You must be logged in to create a listing');
               if (files.length > 0 && formData.imageUrls.length === 0) return setError('You selected images but did not click "Upload". Please click "Upload" first.');
               if (formData.imageUrls.length < 1) return setError('You must upload at least one image');
               if (formData.offer && +formData.regularPrice <= +formData.discountPrice) return setError('Discount price must be lower than regular price');
               
               setLoading(true);
               setError(false);
               const res = await fetch('/api/listing/create', {
                  method: 'POST',
                  headers: {
                     'Content-Type' : 'application/json',
                  },
                  credentials: 'include',
                  body: JSON.stringify({
                     ...formData,
                     userRef: currentUser._id,
                  }),
               });

               const data = await res.json();
               setLoading(false);
               if (!res.ok || data.success === false) {
                  if (res.status === 401 || data.message === 'Unauthorized') {
                     setError('Your session has expired. Please sign out and sign in again to refresh your login.');
                  } else {
                     setError(data.message || 'Failed to create listing');
                  }
                  return;
               }
               if (data._id) {
                  navigate(`/listing/${data._id}`);
               } else {
                  setError('Listing was created but no ID was returned');
               }
            } catch (error) {
               setError(error.message);
               setLoading(false);
            }
         };

  return (
    <main className='p-3 max-w-4xl mx-auto'> 
        <h1 className='text-3xl font-semibold text-center my-7'>Create a Listing</h1>
        <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
            <div className="flex flex-col gap-4 flex-1"> 
                <input type="text" placeholder="Name" className='border p-3 rounded-lg' id='name' maxLength='62' minLength='10' required onChange={handleChange} value={formData.name} />
                <textarea type="text" placeholder="Description" className='border p-3 rounded-lg' id='description'  required onChange={handleChange} value={formData.description} />
                <input type="text" placeholder="Address" className='border p-3 rounded-lg' id='address' required onChange={handleChange} value={formData.address}/>

                  <div className='flex gap-6 flex-wrap'> 
                    <div className='flex gap-2'>
                    <input type="checkbox" id='sale' className='w-5' onChange={handleChange} checked={formData.type === 'sale'}/>
                    <span>Sell</span>
                    </div>

                     <div className='flex gap-2'>
                    <input type="checkbox" id='rent' className='w-5' onChange={handleChange} checked={formData.type === 'rent'}/>
                    <span>Rent</span>
                    </div>

                     <div className='flex gap-2'>
                    <input type="checkbox" id='parking' className='w-5' onChange={handleChange} checked={formData.parking}/>
                    <span>Parking spot</span>
                    </div>

                    <div className='flex gap-2'>
                    <input type="checkbox" id='furnished' className='w-5' onChange={handleChange} checked={formData.furnished}/>
                    <span>furnished</span>
                    </div>

                     <div className='flex gap-2'>
                    <input type="checkbox" id='offer' className='w-5' onChange={handleChange} checked={formData.offer}/>
                    <span>Offer</span>
                    </div>

                  </div>
                  <div className='flex flex-wrap gap-6'>
                  <div className='flex items-center gap-2'>
                     <input type="number" id="bedrooms" min='1' max='10' required className='p-3 border border-gray-300 rounded-lg' onChange={handleChange} value={formData.bedrooms}/>
                     <p>Beds</p>
                  </div>

                  <div className='flex items-center gap-2'>
                     <input type="number" id="bathrooms" min='1' max='10' required className='p-3 border border-gray-300 rounded-lg' onChange={handleChange} value={formData.bathrooms}/>
                     <p>Baths</p>
                  </div>

                  <div className='flex items-center gap-2'>
                     <input type="number" id="regularPrice" min='50' max='1000000' required className='p-3 border border-gray-300 rounded-lg' onChange={handleChange} value={formData.regularPrice}/>
                     <div className='flex flex-col items-center'>
                        <p>Regular Price</p>
                        <span className='text-xs'>($/month)</span>
                     </div>
                     
                  </div>

                  {formData.offer && (
                     <div className='flex items-center gap-2'>
                        <input type="number" id="discountPrice" min='0' max='1000000' required className='p-3 border border-gray-300 rounded-lg' onChange={handleChange} value={formData.discountPrice}/>
                        <div className='flex flex-col items-center'>
                        <p>Discounted Price</p>
                        <span className='text-xs'>($/month)</span>
                     </div>
                  </div>
                  )}
            </div>
            </div>

            <div className='flex flex-col flex-1 gap-4'>
                <p className='font-semibold'>
                    Images:
                    <span className='font-normal text-gray-600 ml-2'>The first image will be the cover (max 6)</span>
                </p>

                <div className='flex gap-4'>
                    <input ref={fileInputRef} onChange={(e) => setFiles(e.target.files)} className='p-3 border border-gray-300 rounded w-full' type="file" id='images' accept='image/*' multiple />
                    <button type='button' disabled={uploading} onClick={handleImageSubmit} className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'>{uploading ? 'Uploading...' : 'Upload'}</button>
                </div>
                {files.length > 0 && (
                    <p className='text-xs text-blue-600 font-medium'>
                        {files.length} file(s) selected. Click &quot;Upload&quot; to upload them.
                    </p>
                )}
                {imageUploadError && <p className='text-red-700 text-sm'>{imageUploadError}</p>}
                {
                  formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
                    <div key={url}className='flex justify-between p-3 border items-center'>
                      <img src={url} alt="listing image" className='w-20 h-20 object-contain rounded-lg' />
                      <button type='button' onClick={() =>handleRemoveImage(index)} className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'>Delete</button>
                    </div>
                   ))
                }

                <button disabled={loading || uploading} type='submit' className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>{loading ? 'Creating...' : 'Create Listing'}</button>
                {error && <p className='text-red-700 text-sm'>{error}</p>}
            </div>
        </form>
    </main>
  )
}
