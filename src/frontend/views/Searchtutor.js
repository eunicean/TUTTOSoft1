import React, { useState, useEffect } from 'react';
import '../css/Seachtutor.css';
import { useNavigate } from 'react-router-dom'; 
import baseUrl from '../../config.js';
import ProfilePicture from '../components/profilePicture.js';

const TutorCard = ({ id, name, subjects, year, rating, onStartChat, profileImage }) => {
  return (
    <div className="tutor-card-search">
      <div className="tutor-info-search">
        <ProfilePicture></ProfilePicture>
        <div>
          <h4>{name}</h4>
          <h4>{subjects.join(', ')}</h4> {/* Mostrar todas las materias */}
          <div className="stars">
            {'★'.repeat(rating) + '☆'.repeat(5 - rating)}
          </div>
        </div>
      </div>
      <button onClick={() => onStartChat(id)} className="chat-btn-search">Chat</button>
    </div>
  );
};

const FilterDropdown = ({ selectedSubject, setSelectedSubject }) => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchCourses = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`${baseUrl}/api/courses`, {
          headers: {
            'Authorization': `Bearer ${token}`, 
          }
        });
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <select
      value={selectedSubject}
      onChange={(e) => setSelectedSubject(e.target.value)}
      className="filter-dropdown"
    >
      <option value="">Seleccionar materia</option>
      {courses.map((course) => (
        <option key={course.course_code} value={course.namecourse}>
          {course.namecourse}
        </option>
      ))}
    </select>
  );
};

const TutorsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [tutors, setTutors] = useState([]);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    const fetchTutors = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`${baseUrl}/api/tutors`, {
          headers: {
            'Authorization': `Bearer ${token}`, 
          }
        });
        const data = await response.json();

        const tutorsWithImages = await Promise.all(
          data.map(async (tutor) => {
            try {
              const imageResponse = await fetch(`${baseUrl}/api/profile/avatar/${tutor.id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
              });
              const imageData = await imageResponse.json();

              return {
                ...tutor,
                profileImage: imageData.success ? imageData.image : null
              };
            } catch {
              return { ...tutor, profileImage: null };
            }
          })
        );

        const formattedTutors = tutorsWithImages.map(tutor => ({
          id: tutor.id,
          name: tutor.username,
          subjects: tutor.courses.split(', '),
          year: tutor.year || 5,
          rating: Math.round(tutor.avg_rating),
          profileImage: tutor.profileImage
        }));

        setTutors(formattedTutors);
      } catch (error) {
        console.error('Error fetching tutors:', error);
      }
    };

    fetchTutors();
  }, []);

  const startChat = (tutorId) => {
    if (tutorId) {
      navigate('/chat', { state: { tutorId } });
    } else {
      console.error("Tutor ID is invalid. Cannot start chat.");
    }
  };

  const filteredTutors = tutors.filter(tutor => {
    const matchesSubject = selectedSubject === '' || tutor.subjects.includes(selectedSubject);
    const matchesSearchTerm = tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutor.subjects.some(subject => subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
      tutor.year.toString().includes(searchTerm);

    return matchesSubject && matchesSearchTerm;
  });

  return (
    <div className='outer-container-search'>
      <div className="sessions-container-search">
        <div className="tutors-page">
          <div className="header-search">
            <h2>Buscar Tutor</h2>
            <div className="search-container">
              <input
                type="text"
                placeholder="Nombre, materia, año"
                value={searchTerm}
                onChange={handleSearch}
                className="search-input"
              />
              <FilterDropdown selectedSubject={selectedSubject} setSelectedSubject={setSelectedSubject} />
            </div>
          </div>
          <div className="content">
            <div className="tutors-list">
              {filteredTutors.map((tutor) => (
                <TutorCard
                  key={tutor.id}
                  id={tutor.id}
                  name={tutor.name}
                  subjects={tutor.subjects}
                  year={tutor.year}
                  rating={tutor.rating}
                  profileImage={tutor.profileImage}
                  onStartChat={startChat}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorsPage;
