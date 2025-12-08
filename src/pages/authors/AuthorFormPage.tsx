// src/pages/authors/AuthorFormPage.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { authorsService, uploadsService } from "../../api";
import ImageUpload from "../../components/ImageUpload";
import type { Citation, CitationCreateDto } from "../../types";


function AuthorFormPage() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    vardas: "",
    pavarde: "",
    gimimo_metai: "",
    mirties_data: "",
    curiculum_vitae: "",
    nuotrauka: "",
    tautybe: "",
  });

  const [authorImage, setAuthorImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [citations, setCitations] = useState<Citation[]>([]);
  const [deletions, setDeletions] = useState<string[]>([]);

  const [currentCitation, setCurrentCitation] = useState({
    tekstas: "",
    saltinis: "",
    data: "",
  });

  useEffect(() => {
    if (isEditMode && id) {
      fetchAuthor();
    }
  }, [id]);

  const fetchAuthor = async () => {
    try {
      const author = await authorsService.getById(id!);
      setFormData({
        vardas: author.vardas,
        pavarde: author.pavarde,
        gimimo_metai: author.gimimo_metai || "",
        mirties_data: author.mirties_data || "",
        curiculum_vitae: author.curiculum_vitae || "",
        nuotrauka: author.nuotrauka || "",
        tautybe: author.tautybe || "",
      });
      const resp = await authorsService.getAuthorCitations(id!);
      setCitations(resp);
    } catch (err) {
      setError("Nepavyko užkrauti autoriaus informacijos");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCitationChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setCurrentCitation({ ...currentCitation, [e.target.name]: e.target.value });
  };

  const createCitation = () => {
    if (currentCitation.tekstas == "") {
      return;
    }
    setCitations([...citations, {AutoriusId: "", citatos_tekstas: currentCitation.tekstas, citatos_saltinis: currentCitation.saltinis, citatos_data: currentCitation.data, Id: Math.random().toString()}])
    setCurrentCitation({
      tekstas: "",
      saltinis: "",
      data: "",
    })
  };

  const deleteCitation = (
    id: string,
  ) => {
    setDeletions([...deletions, id])
    setCitations(citations.filter(c => c.Id != id))
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.vardas || !formData.pavarde) {
      setError("Užpildykite visus privalomus laukus");
      alert("Užpildykite visus privalomus laukus");
      return;
    }

    if (formData.mirties_data < formData.gimimo_metai) {
      alert("Mirties data anksčiau negu gimimo");
      return;
    }

    setLoading(true);

    try {
      // Įkelti nuotrauką, jei pasirinkta nauja
      let imageUrl = formData.nuotrauka;
      if (authorImage) {
        imageUrl = await uploadsService.uploadAuthorPhoto(authorImage);
      }

      const authorData = {
        vardas: formData.vardas,
        pavarde: formData.pavarde,
        gimimo_metai: formData.gimimo_metai || undefined,
        mirties_data: formData.mirties_data || undefined,
        curiculum_vitae: formData.curiculum_vitae || undefined,
        nuotrauka: imageUrl || undefined,
        tautybe: formData.tautybe || undefined,
      };

      if (isEditMode && id) {
        await authorsService.update(id, authorData);
        for (var i of deletions) {
          authorsService.deletecitata(i);
        }

        for (var citation of citations) {
          console.log(JSON.stringify(citations));
          if (citation.AutoriusId != "") {
            continue;
          }

          var translated: CitationCreateDto = {
            citatos_tekstas: citation.citatos_tekstas,
            citatos_data: citation.citatos_data == "" ? undefined : citation.citatos_data,
            citatos_saltinis: citation.citatos_saltinis,
            AutoriusId: id,
          }
          await authorsService.createcitata(translated);
        }

        alert("Autorius sėkmingai atnaujintas!");
        navigate(`/autoriai/${id}`);
      } else {
        const response = await authorsService.create(authorData);
        for (var citation of citations) {
          var translated: CitationCreateDto = {
            citatos_tekstas: citation.citatos_tekstas,
            citatos_data: citation.citatos_data == "" ? undefined : citation.citatos_data,
            citatos_saltinis: citation.citatos_saltinis,
            AutoriusId: response.Id
          }
          authorsService.createcitata(translated);
        }
        alert("Autorius sėkmingai sukurtas!");
        navigate(`/autoriai/${response.Id}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Nepavyko išsaugoti autoriaus");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-grow max-w-screen-lg mx-auto w-full p-6"
      >
        <h1 className="text-4xl font-bold mb-6">
          {isEditMode ? "Autoriaus redagavimo langas" : "Autoriaus pridėjimo langas"}
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-lg p-6 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold mb-2">Vardas *</label>
              <input
                type="text"
                name="vardas"
                value={formData.vardas}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
                required
                maxLength={100}
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Pavardė *</label>
              <input
                type="text"
                name="pavarde"
                value={formData.pavarde}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
                required
                maxLength={100}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold mb-2">Gimimo data</label>
              <input
                type="date"
                name="gimimo_metai"
                value={formData.gimimo_metai}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Mirties data</label>
              <input
                type="date"
                name="mirties_data"
                value={formData.mirties_data}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-2">Tautybė</label>
            <input
              type="text"
              name="tautybe"
              value={formData.tautybe}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              maxLength={100}
              placeholder="pvz. Lietuvis"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Biografija</label>
            <textarea
              name="curiculum_vitae"
              value={formData.curiculum_vitae}
              onChange={handleChange}
              rows={10}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Parašykite autoriaus biografiją..."
            />
          </div>


          <div className="space-y-3">
              {citations && citations.map((citata) => (
                <div>
                  <p className="text-gray-600 mb-2 line-clamp-2">{citata.citatos_tekstas}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-4">
                      {citata?.citatos_saltinis || "Nežinomas"}
                    </span>
                    <span className="mr-4">
                      {citata.citatos_data || "Nežinoma data"}
                    </span>
                    <span>
                    <button
              type="button"
               onClick={() =>
                deleteCitation(citata.Id)
              }
              disabled={loading}
              className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
            >Ištrinti</button>
                  </span>
                  </div>
                </div>
                
              ))}
              
            </div>


          <div>
            <label className="block font-semibold mb-2">Citata</label>
            <textarea
              name="tekstas"
              value={currentCitation.tekstas}
              onChange={handleCitationChange}
              rows={5}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Parašykite autoriaus citatą..."
            />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold mb-2">Šaltinis</label>
              <input
                type="text"
                name="saltinis"
                value={currentCitation.saltinis}
                onChange={handleCitationChange}
                className="w-full px-4 py-2 border rounded-lg"
                maxLength={100}
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Data</label>
              <input
                type="date"
                name="data"
                value={currentCitation.data}
                onChange={handleCitationChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <button
              type="button"
              onClick={()=>{createCitation()}}
              disabled={loading}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
            >
              Pridėti citatą
            </button>
          </div>
          </div>






          <ImageUpload
            value={authorImage}
            onChange={setAuthorImage}
            currentImageUrl={formData.nuotrauka}
            label="Autoriaus nuotrauka"
          />

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
            >
              {loading ? "Saugoma..." : isEditMode ? "Atnaujinti" : "Sukurti"}
            </button>
            <button
              type="button"
              onClick={() =>
                navigate(isEditMode ? `/autoriai/${id}` : "/autoriai")
              }
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Atšaukti
            </button>
          </div>
        </form>
      </motion.div>

      <Footer />
    </div>
  );
}

export default AuthorFormPage;
