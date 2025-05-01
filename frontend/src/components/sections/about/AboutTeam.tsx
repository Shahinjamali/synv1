'use client';

import React from 'react';
import Image from 'next/image';
import teamData from '@/data/about/team.json';

const Team: React.FC = () => {
  return (
    <section className="team-page" aria-labelledby="team-heading">
      <div className="container">
        <div className="section-title__tagline-box">
          <span className="section-title__tagline">{teamData.tagline}</span>
        </div>
        <h2 className="section-title__title text-white mb-5" id="team-heading">
          {teamData.title}
        </h2>

        <div className="row">
          {teamData.team.map((member, index) => (
            <div
              className="col-xl-3 col-lg-6 col-md-6"
              key={member.name + index}
            >
              <div className="team-one__single">
                <figure className="team-one__img-box">
                  <Image
                    src={member.image}
                    alt={member.name || 'Team member'}
                    width={300}
                    height={200}
                    className="rounded-md"
                    loading="lazy"
                  />
                </figure>
                <figcaption className="team-one__content">
                  <h3 className="team-one__title">{member.name}</h3>
                  <p className="team-one__text">{member.role}</p>
                </figcaption>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
