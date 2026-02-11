import React, { useState } from 'react';
import "./Blog.css";
import african from '../assets/African_Elephant.jpg';
import arctic from '../assets/Arctic_Fox.jpg';
import hummingbird from '../assets/Humming_Bird.jpg';
import humpback from '../assets/Humpback_Whale.jpg';
import bengal from '../assets/Bengal_Tiger.jpg';

const Blog = () => {
  const [selectedPost, setSelectedPost] = useState(null);

  const blogPosts = [
    {
      id: 1,
      title: "Capturing the Majesty of African Elephants",
      excerpt: "An intimate journey documenting elephant herds in their natural habitat across the Serengeti plains.",
      date: "January 15, 2024",
      category: "Safari",
      image: african,
      fullContent: `The African elephant is not just the largest land mammal on Earth; it's a symbol of the wild, untamed beauty of our planet. During my three-week expedition across the Serengeti, I had the privilege of documenting several elephant herds in their natural environment.

**The Golden Hour Magic**

Early morning light provides the most spectacular conditions for wildlife photography. As the sun rises over the savanna, it casts a warm, golden glow that transforms ordinary scenes into extraordinary moments. I positioned myself near a watering hole, knowing that elephants typically visit at dawn. The wait was worth it—a matriarch led her family group through the tall grass, their silhouettes creating dramatic shapes against the emerging light.

**Understanding Elephant Behavior**

Successful wildlife photography requires patience and understanding of animal behavior. Elephants are highly social creatures with complex family structures. I spent days observing their interactions: the gentle trunk touches between mother and calf, the playful sparring of young bulls, and the protective circle adults form around vulnerable members of the herd.

**Technical Considerations**

For these shots, I used a 600mm telephoto lens to maintain a safe distance while capturing intimate details. The key settings were: ISO 400 to balance light sensitivity with noise reduction, aperture at f/5.6 for adequate depth of field, and shutter speed of 1/1000s to freeze motion. These technical choices allowed me to capture the texture of their weathered skin and the intelligence in their eyes.

**Conservation Message**

Every photograph tells a story, but it also carries a responsibility. African elephants face tremendous pressure from habitat loss and poaching. Through these images, I hope to inspire appreciation for these magnificent creatures and support for conservation efforts that protect them for future generations.`
    },
    {
      id: 2,
      title: "Arctic Foxes in Winter Wonderland",
      excerpt: "Tracking and photographing the elusive arctic fox through the harsh Icelandic winter landscape.",
      date: "March  10, 2025",
      category: "Arctic",
      image: arctic,
      fullContent: `The arctic fox is one of nature's most remarkable survivors, perfectly adapted to some of the harshest conditions on Earth. My journey to photograph these incredible animals took me to the remote highlands of Iceland during the peak of winter.

**Preparation and Challenges**

Photographing in sub-zero temperatures presents unique challenges. Camera batteries drain quickly in the cold, so I kept spares warm inside my jacket. Condensation can ruin equipment when moving between temperatures, requiring careful acclimatization. But the biggest challenge was simply finding these masters of camouflage in the vast white landscape.

**The White Phase Phenomenon**

Arctic foxes undergo remarkable seasonal changes. In winter, their coat transforms to pure white, providing perfect camouflage against the snow. I spent four days tracking a family group, learning their hunting patterns and den locations. Their thick winter fur makes them appear almost spherical—an adorable adaptation that minimizes heat loss.

**Behavioral Insights**

These foxes are opportunistic hunters, capable of detecting prey beneath several feet of snow using their exceptional hearing. I witnessed a fox perform a characteristic high jump, diving headfirst into the snow to catch a lemming. Capturing this behavior required anticipation and incredibly fast reflexes—my camera was set to continuous shooting mode at 10 frames per second.

**Photography Techniques**

Working with white subjects on white snow challenges the camera's metering system. I used exposure compensation of +1 to +2 stops to ensure the snow appeared white rather than gray. Focus was critical; I relied on single-point autofocus on the fox's eyes to ensure sharpness where it matters most.

**The Conservation Story**

Climate change threatens arctic ecosystems. Warmer temperatures reduce snow cover, making the white winter coat less effective as camouflage. Additionally, red foxes are moving northward, competing with their smaller arctic cousins. These photographs document not just beauty, but a way of life that may be changing forever.`
    },
    {
      id: 3,
      title: "The Secret Life of Hummingbirds",
      excerpt: "High-speed photography reveals the incredible aerial abilities of these tiny jeweled birds.",
      date: "November 21, 2020",
      category: "Birds",
      image: hummingbird,
      fullContent: `Hummingbirds are nature's helicopters—capable of hovering, flying backward, and performing aerial acrobatics that defy belief. Capturing their incredible speed and agility required specialized equipment and weeks of dedicated observation in the cloud forests of Costa Rica.

**Setting Up the Shot**

Hummingbirds beat their wings up to 80 times per second, making standard photography techniques inadequate. I created a dedicated photography station near a cluster of heliconia flowers—a favorite nectar source. The setup included multiple flash units capable of extremely short flash durations (1/10,000s) to freeze the wing motion.

**The Technical Challenge**

High-speed photography requires precise timing. I used infrared beam triggers that detected when a hummingbird entered the frame, automatically firing the camera and flashes. This allowed me to capture moments impossible to time manually—wings at full extension, tongues extended into flowers, and mid-air territorial disputes between males.

**Species Diversity**

Costa Rica hosts over 50 hummingbird species, each with unique characteristics. The violet sabrewing, with its curved bill and iridescent plumage, was a frequent visitor. Male fiery-throated hummingbirds displayed their brilliant throat patches during courtship displays. Each species required different approach strategies and photography techniques.

**Understanding the Metabolism**

These tiny birds have the highest metabolism of any warm-blooded animal. They must consume half their body weight in nectar daily, visiting hundreds of flowers. Watching them feed provided insights into pollination relationships—their heads become dusted with pollen as they probe deep into tubular flowers, facilitating plant reproduction.

**Revealing Hidden Beauty**

When frozen by high-speed photography, hummingbird wings reveal intricate patterns invisible to the naked eye. The iridescent feathers contain microscopic structures that refract light, producing colors that shift depending on viewing angle. These photographs don't just document behavior; they reveal hidden dimensions of beauty.

**Conservation Awareness**

Hummingbirds are indicators of ecosystem health. Habitat fragmentation and pesticide use threaten many species. By sharing these images, I hope to foster appreciation for these remarkable birds and the intact forest habitats they require.`
    },
    {
      id: 4,
      title: "Underwater Giants: Photographing Humpback Whales",
      excerpt: "Swimming alongside humpback whales in the crystal waters of Tonga's pacific sanctuary.",
      date: "December 28, 2023",
      category: "Marine",
      image: humpback,
      fullContent: `There are few experiences more humbling than floating in open ocean as a 40-ton humpback whale glides past, close enough to look into its intelligent eye. Tonga, in the South Pacific, is one of the few places where swimming with humpback whales is permitted under strict guidelines.

**The Tonga Experience**

Every winter, humpback whales migrate from Antarctic feeding grounds to Tonga's warm waters to breed and raise calves. These shallow, protected bays provide ideal conditions for both whales and photographers. The water clarity is exceptional—often exceeding 40 meters visibility—allowing for stunning underwater imagery.

**Respectful Approach**

Photographing marine mammals requires strict ethical protocols. We maintained minimum distances, never pursued or cornered whales, and limited our time in the water. The whales themselves often approached us out of curiosity, particularly the playful juveniles who seemed fascinated by our presence.

**Mother and Calf Bonds**

The most memorable encounters involved mother-calf pairs. I witnessed nursing behavior, protective positioning, and teaching moments as mothers prepared their calves for the long migration ahead. One particularly special moment came when a mother whale positioned herself between our group and her calf—not aggressively, but clearly establishing boundaries. We respectfully withdrew, and she relaxed, allowing us to observe from a distance.

**Technical Underwater Challenges**

Underwater photography presents unique challenges. Water absorbs light rapidly, especially red wavelengths, creating blue-dominated images. I used high-quality strobes to restore natural colors in close-up shots. For wide-angle scenes of entire whales, I relied on natural light, shooting upward to silhouette whales against the bright surface.

**Capturing Behavior**

Humpbacks are expressive animals. I documented pectoral fin waving, tail slapping, and the haunting beauty of their underwater songs (yes, you can hear them clearly while swimming). Males perform complex songs that can last 20 minutes, possibly for courtship or territorial purposes. Capturing a whale in mid-song—mouth open, body angled—required patience and anticipation.

**The Power of Connection**

Eye contact with a whale is transformative. Their eyes show awareness and intelligence. In one encounter, a whale slowly rolled onto its side to look directly at me. We maintained eye contact for perhaps 30 seconds—a brief moment in human time, but an eternity underwater. That connection reminds us these are not just subjects for photography; they are sentient beings sharing our planet.

**Conservation Imperative**

Humpback populations have recovered significantly since commercial whaling ended, demonstrating that conservation efforts work. However, threats remain: ship strikes, entanglement in fishing gear, ocean noise pollution, and climate change affecting their food sources. These photographs celebrate recovery while highlighting the ongoing need for ocean protection.`
    },
    {
      id: 5,
      title: "The Silent King: Photographing the Bengal Tiger",
      excerpt: "Elusive, powerful, and watchful — the Bengal tiger is not just a predator but a symbol of the wild itself. ",
      date: "December 28, 2023",
      category: "Safari",
      image: bengal,
      
    }
  ];

  return (
    <div className="blog-container">
      

      <main className="main-content">
        
        <section className="blog-posts">
          <div className="posts-grid">
            {blogPosts.map((post) => (
              <article key={post.id} className="post-card">
                <div className="post-image">
                  <img src={post.image} alt={post.title} />
                  <span className="post-category">{post.category}</span>
                </div>
                <div className="post-content">
                  <h3>{post.title}</h3>
                  <p className="post-excerpt">{post.excerpt}</p>
                  <div className="post-meta">
                    <span className="post-author">{post.author}</span>
                    <span className="post-date">{post.date}</span>
                  </div>
                  <button 
                    className="read-more"
                    onClick={() => setSelectedPost(post)}
                  >
                    Read More →
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      {selectedPost && (
        <div className="modal-overlay" onClick={() => setSelectedPost(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedPost(null)}>×</button>
            <img src={selectedPost.image} alt={selectedPost.title} className="modal-image" />
            <h2>{selectedPost.title}</h2>
            <div className="modal-meta">
              <span>{selectedPost.author}</span>
              <span>{selectedPost.date}</span>
              <span className="modal-category">{selectedPost.category}</span>
            </div>
            <p>{selectedPost.excerpt}</p>
            <div className="modal-body" style={{ whiteSpace: 'pre-line' }}>
              {selectedPost.fullContent}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;