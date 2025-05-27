import {
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonContent,
    IonHeader,
    IonIcon,
    IonList,
    IonPage,
    IonProgressBar,
    IonTitle,
    IonToolbar
} from '@ionic/react';
import './Tab1.css';
import {useEffect, useState} from "react";
import {eye, gitBranch, star} from "ionicons/icons";
import LanguageIcon from "../components/LanguageIcon";

interface Repository {
    id: number;
    name: string;
    description: string | null;
    html_url: string;
    stargazers_count: number;
    forks_count: number;
    watchers_count: number;
    languages_url: string;
}

interface LanguageStats {
    [key: string]: number;
}

const Tab1: React.FC = () => {

  const [repositories, setRepositories] = useState<Repository[]>([])
  const [repoLanguages, setRepoLanguages] = useState<{ [key: string]: LanguageStats }>({});
  const [errors, setErrors] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

    const fetchLanguages = async (repo: Repository) => {
      try {
          const response = await fetch(repo.languages_url)
          if (!response.ok) {
              throw new Error('Failed to fetch languages for repo' + repo.id)
          }

          const data = await response.json()
          setRepoLanguages(prev => ({
              ...prev,
              [repo.id]: data
          }))
      } catch (e) {
          console.error(`Error fetching languages for ${repo.name}`, e)
      }
    }

    useEffect(() => {
        const fetchRepositories = async () => {
            try {
                setLoading(true)
                const response = await fetch('https://api.github.com/users/Ewennnn/repos')

                if (!response.ok) {
                    setErrors('Failed to fetch repositories')
                    return
                }

                const data = await response.json()
                data.forEach((repo: Repository) => {
                    fetchLanguages(repo)
                })
                setRepositories(data)
            } catch (e) {
                setErrors(e instanceof Error ? e.message : 'An error occurred')
            } finally {
                setLoading(false)
            }
        }

        fetchRepositories().then(() => {})
    }, []);

    const calculateLanguagePercentage = (languages: LanguageStats) => {
        const total = Object.values(languages).reduce((acc, curr) => acc + curr, 0);
        return Object.entries(languages).map(([lang, bytes]) => ({
            name: lang,
            percentage: ((bytes / total) * 100).toFixed(1)
        }));
    };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
            <a href="http://github.com/Ewennnn" style={{ textDecoration: 'none' }}>
                <IonTitle>Ewennn Github Repositories</IonTitle>
            </a>
            {loading && (
                <IonProgressBar type="indeterminate"></IonProgressBar>
            )}
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
          {errors && (
              <IonCard color="danger">
                  <IonCardContent>
                      Erreur
                  </IonCardContent>
              </IonCard>
          )}

          {/* Liste */}
          <IonList>
              {repositories.map(repo => (

                  <IonCard key={repo.id} href={repo.html_url} target="_blank">
                      <IonCardHeader>
                          <IonCardTitle>{repo.name}</IonCardTitle>
                      </IonCardHeader>

                      <IonCardContent>
                          <p>{repo.description ?? 'No description'}</p>
                          <div style={{ marginTop: '10px' }}>
                              <div className="languages-container">
                                  {repoLanguages[repo.id] && (
                                      calculateLanguagePercentage(repoLanguages[repo.id]).map(lang => (
                                          <LanguageIcon
                                              key={lang.name}
                                              language={lang.name}
                                              percentage={lang.percentage}
                                          />
                                      ))
                                  )}
                              </div>

                              <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                                  <div>
                                      <IonIcon icon={star} /> {repo.stargazers_count}
                                  </div>
                                  <div>
                                      <IonIcon icon={gitBranch} /> {repo.forks_count}
                                  </div>
                                  <div>
                                      <IonIcon icon={eye} /> {repo.watchers_count}
                                  </div>
                              </div>
                          </div>
                      </IonCardContent>
                  </IonCard>
              ))}
          </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
